#pragma once

#include <napi.h>
#include <unistd.h>
#include <sys/mman.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <iostream>
#include <string>
#include <fstream>
#include <sstream>
#include <fcntl.h>
#include <chrono>
#include <thread>

using namespace Napi;

class FastTail : public ObjectWrap<FastTail>
{
public:
    FastTail(const CallbackInfo&);
    Napi::Value Tail(const CallbackInfo&);
    Napi::Value GetLogUri(const CallbackInfo&);

    static Function GetClass(Napi::Env);
private:
    void UsingMMap(Napi::Env env, Napi::Function cb, int m_target);
    int currentIndex = 0;
    std::string logUri;
};