import huey

# huey_consumer djangobackend.huey_app.huey_task -w 4

huey_task = huey.RedisHuey('cartapi')

@huey_task.periodic_task(huey.crontab(hour='*'))
def check_endpoints():
    pass


@huey_task.periodic_task(huey.crontab(hour='*'))
def check_carts():
    pass
