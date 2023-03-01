import subprocess


class Plugin:
    bus = "unix:path=/run/user/1000/bus"
    env = {
            'DBUS_SESSION_BUS_ADDRESS': bus
    }

    async def start_service(self):
        args = ["/usr/bin/systemd-run",
            "--user",
            "--scope",
            "--setenv=DISPLAY=:0",
            "--setenv=DBUS_SESSION_BUS_ADDRESS=" + self.bus,
            "--uid", "1000",
            "--unit", "deck-kdeconnectd",
            "/usr/lib/kdeconnectd"
        ]

        subprocess.Popen(args, stdout=None, stderr=None, stdin=subprocess.DEVNULL, start_new_session=True, env=self.env)
        return 0

    async def stop_service(self):
        subprocess.run(["/usr/bin/systemctl", '--user', 'stop', 'deck-kdeconnectd.scope'], check=True, env=self.env)
        return 0

    async def get_connected_devices(self):
        output = subprocess.check_output(["/usr/bin/kdeconnect-cli", "-a", "--name-only"], env=self.env).decode('utf-8')
        return output
