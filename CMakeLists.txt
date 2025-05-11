cmake_minimum_required(VERSION 3.10)
project(index)
project(index_en)

# 设置 C++ 标准
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# 设置输出后缀（可选，html 适配 emcc 输出）
set(CMAKE_EXECUTABLE_SUFFIX ".html")

# 设置 libxr 所需变量（你自己的库中可能需要）
set(LIBXR_SYSTEM "WebAsm")
set(LIBXR_DRIVER "WebAsm")

# 添加 libxr 子目录
add_subdirectory(libxr)

# 创建主程序可执行文件
add_executable(index main.cpp)
add_executable(index_en main.cpp)

# 包含 libxr 的头文件路径
target_include_directories(index
    PRIVATE
    $<TARGET_PROPERTY:xr,INTERFACE_INCLUDE_DIRECTORIES>
)

target_include_directories(index_en
    PRIVATE
    $<TARGET_PROPERTY:xr,INTERFACE_INCLUDE_DIRECTORIES>
)   

# 链接 libxr 库
target_link_libraries(index PRIVATE xr)
target_link_libraries(index_en PRIVATE xr)

# 添加 emscripten 链接参数（等效于 emcc 的 -s WASM=1）
set_target_properties(index PROPERTIES
    LINK_FLAGS "-s WASM=1 -s EXIT_RUNTIME=0 -s USE_PTHREADS=1 \
    -sEXPORTED_FUNCTIONS=['_main','_receive_input','_button_click'] -sEXPORTED_RUNTIME_METHODS=['ccall','cwrap'] \
    --pre-js ${CMAKE_CURRENT_SOURCE_DIR}/third_party/xterm/xterm.min.js \
    --pre-js ${CMAKE_CURRENT_SOURCE_DIR}/third_party/xterm/xterm-addon-fit.min.js \
    --pre-js=${CMAKE_SOURCE_DIR}/inject.js"
)
set_target_properties(index_en PROPERTIES
    LINK_FLAGS "-s WASM=1 -s EXIT_RUNTIME=0 -s USE_PTHREADS=1 \
    -sEXPORTED_FUNCTIONS=['_main','_receive_input','_button_click'] -sEXPORTED_RUNTIME_METHODS=['ccall','cwrap'] \
    --pre-js ${CMAKE_CURRENT_SOURCE_DIR}/third_party/xterm/xterm.min.js \
    --pre-js ${CMAKE_CURRENT_SOURCE_DIR}/third_party/xterm/xterm-addon-fit.min.js \
    --pre-js=${CMAKE_SOURCE_DIR}/inject_en.js"
)

execute_process(
    COMMAND cp ${CMAKE_SOURCE_DIR}/third_party/xterm/xterm.css ${CMAKE_BINARY_DIR}
)

target_compile_options(index PRIVATE -matomics -mbulk-memory)

target_compile_options(index_en PRIVATE -matomics -mbulk-memory)

target_compile_options(xr PRIVATE -matomics -mbulk-memory)

target_compile_options(index PRIVATE -pthread)

target_compile_options(index_en PRIVATE -pthread)

target_compile_options(xr PRIVATE -pthread)
