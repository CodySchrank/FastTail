#pragma once

#include "fasttail.h"

using namespace Napi;

class Worker : public AsyncWorker {
    public:
        Worker(std::string logUri, int m_target, Napi::Env env, Napi::Function lineCb, Napi::Function eofCb)
        : AsyncWorker(eofCb), logUri(logUri), env(env), m_target(m_target), lineCb(lineCb), eofCb(eofCb) {}

        void UsingMMap(Napi::Env env, Napi::Function cb);

        ~Worker() {}
    // This code will be executed on the worker thread
    void Execute() {
        this->UsingMMap(env, lineCb);
    }

    void OnOK() {
        HandleScope scope(Env());

        Callback().Call({Env().Null(), String::New(Env(), "EOF")});
    }

    private:
        std::string logUri;
        Napi::Env env;
        int m_target;
        Napi::Function lineCb;
        Napi::Function eofCb;
        int currentIndex = 0;
};