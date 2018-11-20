#pragma once

#include "fasttail.h"

using namespace Napi;

class Worker : public AsyncWorker {
    public:
        Worker(std::string logUri, int m_target, Napi::Function& lineCb, Napi::Function& eof)
        : AsyncWorker(lineCb), logUri(logUri), m_target(m_target), eof(Napi::Persistent(eof)) {}

        void UsingMMap();

        ~Worker() {}
    // This code will be executed on the worker thread
    void Execute() {
        this->UsingMMap();
    }

    void OnOK() {
        HandleScope scope(Env());

        for (size_t i = 0; i < this->tails.size(); i++)
        {
            Callback().Call({Napi::String::New(Env(), this->tails[i])});
        }

        this->eof.Call({});
    }

    private:
        std::string logUri;
        int m_target;
        int currentIndex = 0;
        Napi::FunctionReference eof;
        std::vector<std::string> tails;
};