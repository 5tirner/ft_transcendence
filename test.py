import asyncio

async def fetch():
    print("hello bro")
    await asyncio.sleep(2)
    print("hello done")

async def legend():
    print("legend pro")
    await asyncio.sleep(1)
    print("legend done")

async def main():
    # task1 = asyncio.create_task(fetch())
    # task2 = asyncio.create_task(legend())
    value1 = await fetch()
    value2 = await legend()
    print(f"value1: {value1}")
    print(f"value2: {value2}")
asyncio.run(main())