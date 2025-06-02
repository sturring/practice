#include <vector>
#include <string>


std::vector<unsigned char> blur_filter(const std::vector<unsigned char>& input, int width, int height) {
    std::vector<unsigned char> output = input;
    int radius = 1;

    for (int y = 0; y < height; ++y) {
        for (int x = 0; x < width; ++x) {
            int r = 0, g = 0, b = 0, a = 0, count = 0;

            for (int dy = -radius; dy <= radius; ++dy) {
                for (int dx = -radius; dx <= radius; ++dx) {
                    int nx = x + dx, ny = y + dy;
                    if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                        int idx = 4 * (ny * width + nx);
                        r += input[idx];
                        g += input[idx + 1];
                        b += input[idx + 2];
                        a += input[idx + 3];
                        count++;
                    }
                }
            }

            int idx = 4 * (y * width + x);
            output[idx] = r / count;
            output[idx + 1] = g / count;
            output[idx + 2] = b / count;
            output[idx + 3] = a / count;
        }
    }

    return output;
}

#include <pybind11/pybind11.h>
#include <pybind11/stl.h>

namespace py = pybind11;

std::vector<unsigned char> apply_filter_cpp(const std::vector<unsigned char>& data, int width, int height, const std::string& filter_name) {
    if (filter_name == "blur") {
        return blur_filter(data, width, height);
    }
    // Заглушка — інші фільтри повертають як є
    return data;
}

PYBIND11_MODULE(filter, m) {
    m.def("apply_filter_cpp", &apply_filter_cpp);
}