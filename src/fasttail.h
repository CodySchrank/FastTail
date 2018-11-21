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
    Napi::Value ReadFromIndex(const CallbackInfo&);
    Napi::Value GetLastIndex(const CallbackInfo&);
    Napi::Value GetLogUri(const CallbackInfo&);

    double UsingMapGetLastIndex();

    std::string logUri;

    static Function GetClass(Napi::Env);
};