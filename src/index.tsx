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

const Content: VFC<{ serverAPI: ServerAPI }> = ({ serverAPI }) => {
  return (
    <PanelSection title="Manage">
      <PanelSectionRow>
        <ButtonItem
          layout="below"
          onClick={async (e) => {
              const res = await serverAPI.callPluginMethod("add", {left: 2, right: 2});
              showModal(
                <ConfirmModal
                  onOK={()=>{}}
                  onCancel={()=>{}}
                  strTitle={'Result'}
                >
                  {JSON.stringify(res)}
                </ConfirmModal>
              )
          }}
        >
          Start KDE Connect
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
