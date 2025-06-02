from setuptools import setup, Extension
import pybind11

ext_modules = [
    Extension(
        'filter',
        ['filter.cpp'],
        include_dirs=[pybind11.get_include()],
        language='c++'
    ),
]

setup(
    name='filter',
    version='0.0.1',
    author='Your Name',
    description='C++ module with pybind11',
    ext_modules=ext_modules,
)