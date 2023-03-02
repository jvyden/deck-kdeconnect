import subprocess


class Plugin:

    # TODO: add support in decky loader to grab user's id (avoids hardcoding as shown here)
    bus = "unix:path=/run/user/1000/bus"
    env = {
            'DBUS_SESSION_BUS_ADDRESS': bus
    }

    unit = "deck-kdeconnectd"
    unitScope = unit + ".scope"

    async def start_service(self):
        args = ["/usr/bin/systemd-run",
            "--user",
            "--scope",
            "--setenv=DISPLAY=:0",
            "--setenv=DBUS_SESSION_BUS_ADDRESS=" + self.bus,
            "--uid", "1000",
            "--unit", self.unit,
            "/usr/lib/kdeconnectd"
        ]

        subprocess.Popen(args, stdout=None, stderr=None, stdin=subprocess.DEVNULL, start_new_session=True, env=self.env)
        return "Started service"

    async def stop_service(self):
        subprocess.run(["/usr/bin/systemctl", '--user', 'stop', self.unitScope], check=True, env=self.env)
        return "Stopped service"
    
    async def is_service_running(self):
        result = subprocess.run(["/usr/bin/systemctl", '--user', 'is-active', self.unitScope], env=self.env)
        return result.returncode == 0


    async def get_connected_devices(self):
        output = subprocess.check_output(["/usr/bin/kdeconnect-cli", "-a", "--name-only"], env=self.env).decode('utf-8')
        return output
