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
import { VFC } from "react";
import { FaMobileAlt } from "react-icons/fa";

const showResult = (res: any) => {
  showResultStr(JSON.stringify(res))
}

const showResultStr = (res: string) => {
  showModal(
    <ConfirmModal
      onOK={()=>{}}
      onCancel={()=>{}}
      strTitle={'Result'}
    >
      <pre>{res}</pre>
    </ConfirmModal>
  )
}

const startService = async (serverAPI: ServerAPI) => {
  const res = await serverAPI.callPluginMethod("start_service", {});
  showResult(res)
}

const stopService = async (serverAPI: ServerAPI) => {
  const res = await serverAPI.callPluginMethod("stop_service", {});
  showResult(res)
}

const getConnectedDevices = async (serverAPI: ServerAPI) => {
  const res = await serverAPI.callPluginMethod<{}, string>("get_connected_devices", {});

  if(res.success) {
    showResultStr(res.result)
  }
  else {
    showResult(res)
  }
}

const Content: VFC<{ serverAPI: ServerAPI }> = ({ serverAPI }) => {
  return (
    <PanelSection title="Manage Service">
      <PanelSectionRow>
        <ButtonItem
          layout="below"
          onClick={async() => startService(serverAPI)}
        >
          Start KDE Connect
        </ButtonItem>

        <ButtonItem
          layout="below"
          onClick={async() => stopService(serverAPI)}
        >
          Stop KDE Connect
        </ButtonItem>

        <ButtonItem
          layout="below"
          onClick={async() => getConnectedDevices(serverAPI)}
        >
          Show Connected Devices
        </ButtonItem>
      </PanelSectionRow>
    </PanelSection>
  );
};

export default definePlugin((serverApi: ServerAPI) => {
  return {
    title: <div className={staticClasses.Title}>KDE Connect</div>,
    content: <Content serverAPI={serverApi} />,
    icon: <FaMobileAlt />
  };
});
