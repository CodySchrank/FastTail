#pragma once

#include "fasttail.h"

using namespace Napi;

// class Worker : public AsyncWorker {
//     public:
//         Worker(FastTail &fastTail)
//         : AsyncWorker(fastTail.OnEOF) {}
//     private:
//         std::string echo;
// };