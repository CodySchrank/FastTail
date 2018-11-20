#pragma once

#include "fasttail.h"

using namespace Napi;

class Worker : public AsyncWorker {
    public:
        Worker(std::string logUri, double m_target, Napi::Function& lineCb, Napi::Function& eof)
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

        this->eof.Call({Napi::Number::New(Env(), currentIndex)});
    }

    private:
        std::string logUri;
        double m_target;
        double currentIndex = m_target;
        Napi::FunctionReference eof;
        std::vector<std::string> tails;
};