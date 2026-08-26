import huey

# huey_consumer cartapi.huey_app.huey_task -w 4

huey_task = huey.RedisHuey('cartapi')

@huey_task.signal
def simple_signal(*args, **kwargs):
    print('Some signal was sent!', args, kwargs)


# @huey_task.periodic_task(huey.crontab(hour='*'))
# def check_endpoints():
#     pass


# @huey_task.periodic_task(huey.crontab(hour='*'))
# def check_carts():
#     pass
