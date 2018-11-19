#include "fasttail.h"

using namespace Napi;

FastTail::FastTail(const Napi::CallbackInfo &info) : ObjectWrap(info)
{
    Napi::Env env = info.Env();

    if (info.Length() < 1)
    {
        Napi::TypeError::New(env, "Wrong number of arguments")
            .ThrowAsJavaScriptException();
        return;
    }

    if (!info[0].IsString())
    {
        Napi::TypeError::New(env, "Must pass in string to file")
            .ThrowAsJavaScriptException();
        return;
    }

    this->logUri = info[0].As<Napi::String>().Utf8Value();
}

void FastTail::UsingMMap(Napi::Env env, Napi::Function cb, int m_target)
{
    int input = ::open(this->logUri.c_str(), O_RDONLY);
    if (input < 0) {
        Napi::TypeError::New(env, "Could not open " + this->logUri)
            .ThrowAsJavaScriptException();
        return;
    }

    struct ::stat infos;
    if (::fstat(input, &infos) != 0) {
        Napi::TypeError::New(env, "Could not stat " + this->logUri)
            .ThrowAsJavaScriptException();
        return;
    }

    char *base = (char *)::mmap(NULL, infos.st_size, PROT_READ, MAP_PRIVATE, input, 0);
    if (base == MAP_FAILED) {
        Napi::TypeError::New(env, "Could not map " + this->logUri)
            .ThrowAsJavaScriptException();
        return;
    }

    char const *end = base + infos.st_size;
    char const *curr = base;
    char const *next = std::find(curr, end, '\n');

    //Skip to target
    for (int count = m_target; count > 0 && curr != end; --count)
    {
        curr = next + 1;
        next = std::find(curr, end, '\n');
    }

    //Tail file from last index
    while (curr != end)
    {
        cb.MakeCallback(env.Global(), { Napi::String::New(env, std::string(curr, next))} );
        curr = next + 1;

        if(int(*curr) != 0) {
            currentIndex++;
            next = std::find(curr, end, '\n');
        } else {
            break;
        }
    }

    ::munmap(base, infos.st_size);
}

Napi::Value FastTail::GetLogUri(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();

    if (info.Length() < 0)
    {
        Napi::TypeError::New(env, "Wrong number of arguments")
            .ThrowAsJavaScriptException();
        return env.Null();
    }

    return Napi::String::New(env, this->logUri);
}

Napi::Value FastTail::Tail(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();

    if (info.Length() < 2)
    {
        Napi::TypeError::New(env, "Wrong number of arguments")
            .ThrowAsJavaScriptException();
        return env.Null();
    }

    if (!info[0].IsFunction())
    {
        Napi::TypeError::New(env, "Must pass in on line callback")
            .ThrowAsJavaScriptException();
        return env.Null();
    }

    if (!info[1].IsFunction())
    {
        Napi::TypeError::New(env, "Must pass in on eof callback")
            .ThrowAsJavaScriptException();
        return env.Null();
    }

    Napi::Function lineCb = info[0].As<Napi::Function>();
    Napi::Function eofCb = info[1].As<Napi::Function>();

    this->UsingMMap(info.Env(), lineCb, 0);

    return env.Null();
}

Napi::Function FastTail::GetClass(Napi::Env env)
{
    return DefineClass(env, "FastTail", {
        FastTail::InstanceMethod("getLogUri", &FastTail::GetLogUri),
        FastTail::InstanceMethod("tail", &FastTail::Tail),
    });
}

Napi::Object Init(Napi::Env env, Napi::Object exports)
{
    Napi::String name = Napi::String::New(env, "FastTail");
    exports.Set(name, FastTail::GetClass(env));
    return exports;
}

NODE_API_MODULE(addon, Init)
