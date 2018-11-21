#include "worker.h"

void Worker::UsingMMap()
{
    this->tails.clear();

    int input = ::open(this->logUri.c_str(), O_RDONLY);
    if (input < 0) {
        Napi::TypeError::New(Env(), "Could not open " + this->logUri)
            .ThrowAsJavaScriptException();
        return;
    }

    struct ::stat infos;
    //stat seg fault on empty file
    if (::fstat(input, &infos) != 0) {
        Napi::TypeError::New(Env(), "Could not stat " + this->logUri)
            .ThrowAsJavaScriptException();
        return;
    }

    char *base = (char *)::mmap(NULL, infos.st_size, PROT_READ, MAP_PRIVATE, input, 0);
    if (base == MAP_FAILED) {
        Napi::TypeError::New(Env(), "Could not map " + this->logUri)
            .ThrowAsJavaScriptException();
        return;
    }

    char const *end = base + infos.st_size;
    char const *curr = base;

    char const *next = std::find(curr, end, '\n');

    //Skip to target
    for (int count = this->m_target; count > 0 && curr != end; --count)
    {
        curr = next + 1;
        if(int(*curr) == 0) {
            break;
        }
        next = std::find(curr, end, '\n');
    }

    //Tail file from last index
    while (curr != end)
    {
        //enter the loop empty
        if(int(*curr) == 0) {
            break;
        }

        std::regex e ("/[\n\r]+/g");
        auto str = std::regex_replace(std::string(curr, next), e, "");

        if(str != "") {
            this->tails.push_back(str);
            this->currentIndex++;
        }

        curr = next + 1;

        //next is not empty
        if(int(*curr) != 0) {
            next = std::find(curr, end, '\n');
        }
    }

    ::munmap(base, infos.st_size);
}