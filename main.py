import subprocess


class Plugin:
    async def start_service(self):
        args = ["/usr/bin/systemd-run",
            "--user",
            "--scope",
            "--setenv=DISPLAY=:0",
            "--setenv=DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/1000/bus",
            "--uid", "1000",
            "--unit", "deck-kdeconnectd",
            "/usr/lib/kdeconnectd"
        ]

        env = {
            'DBUS_SESSION_BUS_ADDRESS': 'unix:path=/var/run/dbus/system_bus_socket'
        }

        subprocess.Popen(args, stdout=None, stderr=None, stdin=subprocess.DEVNULL, start_new_session=True, env=env)
        return 0

    async def stop_service(self):
        subprocess.run(["/usr/bin/killall", 'kdeconnectd'])
        return 0
