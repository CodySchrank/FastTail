#include "fasttail.h"
#include "worker.h"

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

    if (info.Length() < 1)
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

    Napi::Function lineCb = info[0].As<Napi::Function>();

    Worker* wk = new Worker(this->logUri, 0, lineCb);
    wk->Queue();

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
