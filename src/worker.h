#pragma once

#include "fasttail.h"

using namespace Napi;

class Worker : public AsyncWorker {
    public:
        Worker(std::string logUri, double m_target, Napi::Function& lineCb)
        : AsyncWorker(lineCb), logUri(logUri), m_target(m_target) {}

        void UsingMMap();

        ~Worker() {}
    // This code will be executed on the worker thread
    void Execute() {
        this->UsingMMap();
    }

    void OnOK() {
        HandleScope scope(Env());

        auto length = this->tails.size();

        Napi::Array outputArray = Napi::Array::New(Env(), length);

        for (size_t i = 0; i < length; i++)
        {
            outputArray[i] = Napi::String::New(Env(), this->tails.at(i));
        }

        Callback().Call({outputArray, Napi::Number::New(Env(), currentIndex)});
    }

    private:
        std::string logUri;
        double m_target;
        double currentIndex = m_target;
        std::vector<std::string> tails;
};