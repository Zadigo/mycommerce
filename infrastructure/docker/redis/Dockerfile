FROM redis

COPY redis.conf /usr/local/etc/redis/redis.conf

# Create the redis.log file manually
# since for whatever reason Docker mounts
# a directory as opposed to mounting a file

# TODO: When creating a container, the initial
# mount on the volume is a directory which forces
# us to enter te container, delete said directory
# and change the ownership of the file to redis. 
# I have no idea why the initial mount is ALWAYS 
# a directory as opposed to being a file
RUN rm -rf redis.log && touch redis.log

CMD [ "redis-server", "/usr/local/etc/redis/redis.conf" ]
