#include <iostream>
#include <cstdio>
#include <emscripten.h>
#include "libxr.hpp"
#include "webasm_timebase.hpp"
#include <thread>
#include <pthread.h>

int counter = 0;
int thread_test = 0;

void loop()
{
  LibXR::Timer::RefreshTimerInIdle();
}

extern "C"
{
  void button_click()
  {
    XR_LOG_INFO("button click");
  }

  void turn_led_on()
  {
    emscripten_run_script("Module.set_led(true);");
  }

  void turn_led_off()
  {
    emscripten_run_script("Module.set_led(false);");
  }
}

int led_task(void *, int argc, char **argv)
{
  if (argc == 1)
  {
    LibXR::STDIO::Printf("Usage: led <on|off>\n");
  }
  else if (argc == 2)
  {
    if (strcmp(argv[1], "on") == 0)
    {
      turn_led_on();
    }
    else if (strcmp(argv[1], "off") == 0)
    {
      turn_led_off();
    }
    else
    {
      LibXR::STDIO::Printf("Usage: led <on|off>\n");
    }
  }
  else
  {
    LibXR::STDIO::Printf("Usage: led <on|off>\n");
  }

  return 0;
}

auto file = LibXR::RamFS::CreateFile<void *>(
    "led", led_task,
    reinterpret_cast<void *>(0));

int main()
{
  LibXR::PlatformInit();

  LibXR::RamFS ramfs;
  ramfs.Add(file);
  LibXR::Terminal<32, 512, 10, 16> terminal(ramfs);

  auto timer_handle = LibXR::Timer::CreateTask<LibXR::Terminal<32, 512, 10, 16> *>(terminal.TaskFun, &terminal, 10);
  LibXR::Timer::Add(timer_handle);
  LibXR::Timer::Start(timer_handle);

  XR_LOG_DEBUG("This is a example for using libxr in web page");
  XR_LOG_INFO("You can try input in this terminal");
  XR_LOG_PASS("Press button to publish a message");
  XR_LOG_WARN("Input 'led on' or 'led off' to control led");
  XR_LOG_ERROR("Press 'Enter' to start");

  // 注册循环，每帧执行一次
  emscripten_set_main_loop(loop, 0, 1);

  emscripten_exit_with_live_runtime();

  return 0; // 不会真正退出，主循环仍在运行
}
