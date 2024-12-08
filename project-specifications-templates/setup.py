from setuptools import setup, find_namespace_packages

setup(
    name="project-specifications-tools",
    version="0.1",
    packages=find_namespace_packages(where="tools"),
    package_dir={"": "tools"},
    install_requires=[
        'click',
        'termcolor',
    ],
    entry_points={
        'console_scripts': [
            'spec-tools=spectools.cli:cli',
        ],
    },
) 