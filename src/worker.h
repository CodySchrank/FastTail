#pragma once

#include "fasttail.h"

using namespace Napi;

class Worker : public AsyncWorker {
    public:
        Worker(std::string logUri, int m_target, Napi::Function& lineCb)
        : AsyncWorker(lineCb), logUri(logUri), m_target(m_target) {}

        void UsingMMap();

        ~Worker() {}
    // This code will be executed on the worker thread
    void Execute() {
        this->UsingMMap();
    }

    void OnOK() {
        HandleScope scope(Env());

        ArrayBuffer buffer = ArrayBuffer::New(Env(), this->tails.data(), this->tails.size());

        Callback().Call({buffer});
    }

    private:
        std::string logUri;
        int m_target;
        int currentIndex = 0;
        std::vector<uint8_t> tails;
};