from setuptools import setup
from pybind11.setup_helpers import Pybind11Extension, build_ext

ext_modules = [
    Pybind11Extension(
        "filter",                      # Назва модуля
        ["filter.cpp"],               # Список C++ файлів
        language="c++",               # Мова
        cxx_std=17                    # Вкажи стандарт C++
    )
]

setup(
    name="filter",
    version="0.0.1",
    author="Your Name",
    description="C++ module with pybind11",
    ext_modules=ext_modules,
    cmdclass={"build_ext": build_ext},  # Це дозволяє pybind11 обробляти збірку
    zip_safe=False,
)
