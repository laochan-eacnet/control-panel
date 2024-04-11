import { Show, Signal, createSignal, onMount } from 'solid-js'

import './App.css'
import CustomizeSelector from './components/CustomizeSelector'
import { bgms, customize, customizeText, otherCustomize, otherCustomizeText } from './data'
import { Pdata, PlayerCustomizeSetting, api } from './api';

function App() {
  let tokenInput: HTMLInputElement;
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal('');
  const [token, setToken] = createSignal(localStorage.getItem('token'));
  const [pdata, setPdata] = createSignal<Pdata | undefined>(undefined);
  const [customizeSetting, setCustomizeSetting] = createSignal<PlayerCustomizeSetting | undefined>(undefined);

  const loadData = async () => {
    const t = token();
    if (!t) {
      setLoading(false);
      return;
    }

    const result = await api.getCustomizeSetting(t);
    setCustomizeSetting(result.customize);
    setLoading(false);
  }

  const tryVerify = async (token: string) => {
    setLoading(true);

    const result = await api.getPdata(token);
    setPdata(result.pdata);

    if (!pdata()) {
      setError('不存在此游戏账号, 请检查 Token!');
      setLoading(false);
      setToken(null);

      return;
    }

    setToken(token);
    localStorage.setItem('token', token);
    await loadData();
  };

  const saveCustomize = async () => {
    const t = token();
    const c = customizeSetting();
    if (!t || !c) {
      return;
    }

    setLoading(true);
    await api.putCustomizeSetting(t, c);

    window.location.reload();
  }

  onMount(async () => {
    const t = token();
    if (!t) {
      return;
    }

    await tryVerify(t);
  });

  return (
    <>
      <nav>
        <div class="container">
          🗿 Laochan Eacnet CP 🗿 - IIDX
        </div>
      </nav>
      <Show when={loading()}>
        <div class="container text-center">
          <h1>加载中....</h1>
          <img src="images/loading.gif" width="100" alt="moai loading..." />
        </div>
      </Show>
      <Show when={!loading() && !token()}>
        <div class="container mb-3 text-center">
          <div>
            <h2 class="mb-3">请输入启动器内相同的信息</h2>
            <Show when={error() != ''}>
              <h3 style="text-error">{error()}</h3>
            </Show>
            <div class="form-input">
              <label for="token">登陆令牌:&nbsp;&nbsp;</label>
              <input type="text" id="token" ref={tokenInput!} />
            </div>
            <p class="mb-3">
              <small>* 请不要泄漏此令牌, 并妥善保管</small>
            </p>

            <button onclick={() => tryVerify(tokenInput.value)}>登陆</button>
          </div>
        </div>
      </Show>
      <Show when={!loading() && pdata() && customizeSetting()}>
        <div class="container flex">
          <div>
            <div class="player-card">
              <h2>DJ {pdata()!.player.djname}</h2>
              <h3>RIVAL ID: {pdata()!.player.infinitas_id}</h3>
              <h4>SP 游玩次数: {pdata()!.player.play_num_sp}</h4>
              <h4>SP段位: {pdata()!.player.grade_id_sp}</h4>
              <h4>DP 游玩次数: {pdata()!.player.play_num_dp}</h4>
              <h4>DP段位: {pdata()!.player.grade_id_dp}</h4>
              <h4>最后游玩的版本号: {pdata()!.version}</h4>
              
            </div>
          </div>
          <div class="customize">
            <h2>自定义</h2>
            <div class="customize-container">
              {
                Object.entries(customize)
                  .map(([type, values]) => (
                    <CustomizeSelector type={parseInt(type)} values={values} text={customizeText[type]} other={false} signal={[customizeSetting, setCustomizeSetting] as Signal<PlayerCustomizeSetting>}></CustomizeSelector>
                  ))
              }
            </div>
            <hr />
            <div class="customize-container column-5">
              {
                Object.entries(otherCustomize)
                  .map(([type, values]) => (
                    <CustomizeSelector type={parseInt(type)} values={values} text={otherCustomizeText[type]} other={true} signal={[customizeSetting, setCustomizeSetting] as Signal<PlayerCustomizeSetting>}></CustomizeSelector>
                  ))
              }
            </div>
            <hr />
            <div class="mb-3">
              <CustomizeSelector type={10} values={bgms} text="背景音乐" other={false} signal={[customizeSetting, setCustomizeSetting] as Signal<PlayerCustomizeSetting>}></CustomizeSelector>
            </div>
            <button onclick={saveCustomize} class="w-100">保存设置</button>
          </div>
        </div>
      </Show>
      <footer>
        <div class="container">Powered by Laochan</div>
      </footer>
    </>
  )
}

export default App
