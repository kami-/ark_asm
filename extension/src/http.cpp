#include "http.h"

#include "extension.h"
#include "log.h"

#include "Poco/JSON/Object.h"
#include "Poco/Net/HTTPClientSession.h"
#include "Poco/Net/HTTPRequest.h"
#include "Poco/Net/HTTPResponse.h"
#include "Poco/Nullable.h"
#include "Poco/NumberParser.h"
#include "Poco/UUID.h"
#include "Poco/UUIDGenerator.h"

namespace ark_asm {
namespace http {

namespace {
    std::string host, token;
    uint32_t port;
    Poco::UUID missionId;
    std::mutex sessionMutex;
    std::atomic<bool> running;
}

    double parseFloat(const std::string& str) {
        double number = 0;
        if (!Poco::NumberParser::tryParseFloat(str, number)) {
            return 0;
        }
        return number;
    }

    Poco::Nullable<double> getNumericValue(const std::vector<std::string>& parameters, const size_t& idx) {
        if (parameters.size() > idx && !parameters[idx].empty()) {
            double number = 0;
            if (!Poco::NumberParser::tryParseFloat(parameters[idx], number)) {
                return Poco::Nullable<double>();
            }
            return Poco::Nullable<double>(number);
        }
        return Poco::Nullable<double>();
    }

    Poco::Nullable<std::string> getCharValue(const std::vector<std::string>& parameters, const size_t& idx) {
        if (parameters.size() > idx && !parameters[idx].empty()) {
            return Poco::Nullable<std::string>(parameters[idx]);
        }
        return Poco::Nullable<std::string>();
    }

    bool initialize(const std::string& host_, uint32_t port_, const std::string& token_) {
        host = host_;
        port = port_;
        token = token_;
        missionId = Poco::UUIDGenerator::defaultGenerator().createRandom();
        return true;
    }

    void finalize() {
    }

    void run() {
        running = true;
        auto request = extension::popRequest();
        while (request.command != REQUEST_COMMAND_POISON) {
            {
                std::lock_guard<std::mutex> lock(sessionMutex);
                processRequest(request);
            }
            request = extension::popRequest();
        }
        running = false;
    }

    bool isRunning() {
        return running;
    }

    Response processRequest(const Request& request) {
        Response response{ RESPONSE_RETURN_CODE_OK, EMPTY_SQF_DATA };
        log::logger->trace("Request command '{}' params size '{}'!", request.command, request.params.size());
        try {
            if (request.command == "mission.init") {
                missionId = Poco::UUIDGenerator::defaultGenerator().createRandom();
                log::logger->debug("Initialized mission with id '{}'.", missionId.toString());
            }
            else if (request.command == "mission.snapshot" && request.params.size() % 2 == 0) {
                Poco::JSON::Object data;
                data.set("missionId", missionId.toString());
                for (size_t i = 0; i < request.params.size(); i += 2) {
                    data.set(request.params[i], request.params[i + 1]);
                }
                std::stringstream jsonStream;
                data.stringify(jsonStream);
                log::logger->trace("Snapshot JSON is '{}'.", jsonStream.str());

                Poco::Net::HTTPClientSession session(host, port);
                Poco::Net::HTTPRequest httpRequest(Poco::Net::HTTPRequest::HTTP_POST, MISSION_SNAPSHOT_PATH, Poco::Net::HTTPRequest::HTTP_1_1);
                httpRequest.add("Authorization", token);
                httpRequest.setContentType("application/json");
                httpRequest.setContentLength(jsonStream.str().length());
                auto& httpRequestBodyStream = session.sendRequest(httpRequest);
                data.stringify(httpRequestBodyStream);

                Poco::Net::HTTPResponse httpResponse;
                auto& httpReponseBodyStream = session.receiveResponse(httpResponse);
                if (httpResponse.getStatus() != Poco::Net::HTTPResponse::HTTPStatus::HTTP_OK) {
                    std::ostringstream responseBodyOStream;
                    responseBodyOStream << httpReponseBodyStream.rdbuf();
                    log::logger->debug("Error sending snapshot to server. Status '{}', response: '{}'.", httpResponse.getStatus(), responseBodyOStream.str());
                }
                session.reset();
            }
            else {
                log::logger->debug("Invlaid command type '{}'!", request.command);
                response.returnCode = RESPONSE_RETURN_CODE_ERROR;
                response.data = fmt::format("\"Invalid command type!\"");
            }
        }
        catch (Poco::Exception e) {
            log::logger->error("Unexpected error! Error code: '{}', Error message: {}", e.code(), e.displayText());
            response.returnCode = RESPONSE_RETURN_CODE_ERROR;
            response.data = fmt::format("\"Unexpected error! {}\"", e.displayText());
        }
        return response;
    }

} // namespace http
} // namespace ark_asm
