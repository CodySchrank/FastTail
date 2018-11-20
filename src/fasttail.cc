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

Napi::Value FastTail::ReadFromIndex(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();

    if (info.Length() < 3)
    {
        Napi::TypeError::New(env, "Wrong number of arguments")
            .ThrowAsJavaScriptException();
        return env.Null();
    }

    if (!info[0].IsNumber())
    {
        Napi::TypeError::New(env, "Must pass in index")
            .ThrowAsJavaScriptException();
        return env.Null();
    }

    if (!info[1].IsFunction())
    {
        Napi::TypeError::New(env, "Must pass in on line callback")
            .ThrowAsJavaScriptException();
        return env.Null();
    }

    if (!info[2].IsFunction())
    {
        Napi::TypeError::New(env, "Must pass in eof callback")
            .ThrowAsJavaScriptException();
        return env.Null();
    }

    double index = info[0].As<Napi::Number>().DoubleValue();
    Napi::Function lineCb = info[1].As<Napi::Function>();
    Napi::Function eof = info[2].As<Napi::Function>();

    Worker* wk = new Worker(this->logUri, index, lineCb, eof);
    wk->Queue();

    return env.Null();
}

Napi::Function FastTail::GetClass(Napi::Env env)
{
    return DefineClass(env, "FastTail", {
        FastTail::InstanceMethod("getLogUri", &FastTail::GetLogUri),
        FastTail::InstanceMethod("readFromIndex", &FastTail::ReadFromIndex),
    });
}

Napi::Object Init(Napi::Env env, Napi::Object exports)
{
    Napi::String name = Napi::String::New(env, "FastTail");
    exports.Set(name, FastTail::GetClass(env));
    return exports;
}

NODE_API_MODULE(addon, Init)
