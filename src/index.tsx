import {
  ButtonItem,
  definePlugin,
  PanelSection,
  PanelSectionRow,
  ServerAPI,
  ConfirmModal,
  showModal,
  staticClasses,
} from "decky-frontend-lib";
import { VFC, useState, useEffect } from "react";
import { FaMobileAlt, FaSyncAlt } from "react-icons/fa";

const showResult = (res: any) => {
  showResultStr(JSON.stringify(res))
}

const showResultStr = (res: string) => {
  showModal(
    <ConfirmModal
      onOK={() => { }}
      onCancel={() => { }}
      strTitle={'KDE Connect - Error'} // technically can be used for non-errors, but whatevs~
    >
      <pre>{res}</pre>
    </ConfirmModal>
  )
}

const startService = async (serverAPI: ServerAPI) => {
  const res = await serverAPI.callPluginMethod("start_service", {});
  if (!res.success) showResult(res)
  // showResult(res)
}

const stopService = async (serverAPI: ServerAPI) => {
  const res = await serverAPI.callPluginMethod("stop_service", {});
  if (!res.success) showResult(res)
}

const isServiceRunning = async (serverAPI: ServerAPI): Promise<boolean> => {
  const res = await serverAPI.callPluginMethod<{}, boolean>("is_service_running", {});
  if (!res.success) {
    showResult(res)
    return false;
  }

  return res.result;
}

const toggleService = async (serverAPI: ServerAPI) => {
  await isServiceRunning(serverAPI) ? stopService(serverAPI) : startService(serverAPI)
}

const getConnectedDevices = async (serverAPI: ServerAPI): Promise<string[] | null> => {
  const res = await serverAPI.callPluginMethod<{}, string>("get_connected_devices", {});

  if (res.success) {
    // showResultStr(res.result);
    return res.result.trimEnd().split('\n');
  }

  // showResult(res);
  return null;
}

const Content: VFC<{ serverAPI: ServerAPI }> = ({ serverAPI }) => {
  const [running, setRunning] = useState<boolean>(false);
  const [devices, setDevices] = useState<string[]>([]);

  useEffect(() => {
    isServiceRunning(serverAPI).then((val) => setRunning(val));
  })

  useEffect(() => {
    getConnectedDevices(serverAPI).then((val) => {
      if(val == null) {
        setDevices([]);
        return;
      }

      setDevices(val);
    })
  })

  return (
    <div>
      <PanelSection title={`Manage Service (${running ? "Running" : "Stopped"})`}>
        <PanelSectionRow>
          <ButtonItem
            layout="below"
            onClick={async () => {
              toggleService(serverAPI)
              isServiceRunning(serverAPI).then((val) => setRunning(val))
            }}
          >
            {!running ? "Start" : "Stop"} KDE Connect
          </ButtonItem>
          <ButtonItem
            layout="below"
            onClick={async () => showResult(await isServiceRunning(serverAPI))}
          >
            Check status
          </ButtonItem>
        </PanelSectionRow>
      </PanelSection>
      <PanelSection title={`Devices (${devices.length} currently connected)`}>
        {devices.map((val) => <p>{val}</p>)}
        <ButtonItem
          layout="below"
          onClick={async () => {
            getConnectedDevices(serverAPI).then((val) => {
              if(val == null) {
                setDevices([]);
                return;
              }
        
              setDevices(val);
            })
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', columnGap: '5px', justifyContent: 'center' }}>
            <FaSyncAlt />
            <div>Refresh</div>
          </div>
        </ButtonItem>
      </PanelSection>
    </div>
  );
};

export default definePlugin((serverAPI: ServerAPI) => {
  return {
    title: <div className={staticClasses.Title}>KDE Connect</div>,
    content: <Content serverAPI={serverAPI} />,
    icon: <FaMobileAlt />
  };
});
