#ifndef HTTP_H
#define HTTP_H

#include <string>
#include <mutex>


namespace ark_asm {

    const std::string MISSION_SNAPSHOT_PATH = "/mission-snapshot";

    struct Request;
    struct Response;

namespace http {

    bool initialize(const std::string& host_, uint32_t port_, const std::string& token_);
    void finalize();
    void run();
    bool isRunning();
    Response processRequest(const Request& request);

} // namespace http
} // namespace ark_asm

#endif // HTTP_H