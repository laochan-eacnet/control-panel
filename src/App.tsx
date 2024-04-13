import { Show, Signal, createSignal, onMount } from 'solid-js'

import './App.css'
import CustomizeSelector from './components/CustomizeSelector'
import { bgms, customize, customizeText, danNames, otherCustomize, otherCustomizeText } from './data'
import { Pdata, PlayerCustomizeSetting, RivalInfo, api } from './api';
import Customize from './Customize';

function App() {
  let tokenInput: HTMLInputElement, rivalInput: HTMLInputElement;

  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal('');
  const [token, setToken] = createSignal(localStorage.getItem('token'));
  const [pdata, setPdata] = createSignal<Pdata | undefined>(undefined);
  const [customizeSetting, setCustomizeSetting] = createSignal<PlayerCustomizeSetting | undefined>(undefined);
  const [rivalInfo, setRivalInfo] = createSignal<RivalInfo | undefined>(undefined);

  const loadRival = async (t: string) => {
    const rivalInfo = await api.getRivalInfo(t)
    setRivalInfo(rivalInfo);
  }

  const loadCustomize = async (t: string) => {
    const { customize } = await api.getCustomizeSetting(t);
    setCustomizeSetting(customize);
  }

  const loadData = async () => {
    const t = token();
    if (!t) {
      setLoading(false);
      return;
    }

    await Promise.all([
      loadRival(t),
      loadCustomize(t),
    ])

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
    await loadCustomize(t);
    setLoading(false);
  }

  const setRivalState = async (state: boolean) => {
    const t = token();
    if (!t) {
      return;
    }

    setLoading(true);
    await api.changeRivalStatus(t, state);
    await loadRival(t);
    setLoading(false);
  }

  const addRival = async (rivalId: string, playstyle: number) => {
    const t = token();
    const r = rivalInfo();
    if (!t || !r) {
      return;
    }

    setLoading(true);
    const result = await api.addRival(t, rivalId, playstyle);
    if (result.error) {
      alert(result.error);
    }

    await loadRival(t);
    setLoading(false);
  };

  const deleteRival = async (rivalId: string, playstyle: number) => {
    const t = token();
    const r = rivalInfo();
    if (!t || !r) {
      return;
    }

    setLoading(true);
    const result = await api.deleteRival(t, rivalId, playstyle);
    if (result.error) {
      alert(result.error);
    }

    await loadRival(t);
    setLoading(false);
  };

  onMount(async () => {
    const t = token();
    if (!t) {
      return;
    }

    await tryVerify(t);
  });

  return (
    <>
      <nav class="navbar bg-body-tertiary mb-5">
        <div class="container">
          <a class="navbar-brand" href="#">🗿 Laochan Eacnet CP 🗿 - IIDX</a>
        </div>
      </nav>
      <Show when={loading()}>
        <div class="container text-center">
          <h1>加载中....</h1>
          <img src="images/loading.gif" width="100" alt="moai loading..." />
        </div>
      </Show>
      <Show when={!loading() && !token()}>
        <div class="container text-center">
          <div>
            <h2 class="mb-3">请输入启动器内相同的信息</h2>
            <Show when={error() != ''}>
              <h3 style="text-danger">{error()}</h3>
            </Show>
            <div class="w-50 m-auto">
              <div class="form-group mb-3">
                <label class="form-label" for="token">登录令牌:&nbsp;&nbsp;</label>
                <input class="form-control" type="text" id="token" ref={tokenInput!} />
              </div>
              <p class="mb-3">
                <small>* 请不要泄漏此令牌, 并妥善保管</small>
              </p>

              <button class="btn btn-primary" onclick={() => tryVerify(tokenInput.value)}>登陆</button>
            </div>
          </div>
        </div>
      </Show>
      <Show when={!loading() && pdata() && customizeSetting()}>
        <div class="container">
          <div class="row">
            <div class="col">
              <div class="card bg-dark-subtle mb-3">
                <div class="card-body">
                  <h5 class="card-title">DJ {pdata()!.player.djname}</h5>
                  <h6 class="card-subtitle mb-3 text-body-secondary"><small>RIVAL ID: </small>{pdata()!.player.infinitas_id}</h6>
                  <h2></h2>
                  <h6><small class="text-body-secondary">SP 游玩次数: </small>{pdata()!.player.play_num_sp}</h6>
                  <h6><small class="text-body-secondary">SP段位: </small>{danNames[pdata()!.player.grade_id_sp]}</h6>
                  <h6><small class="text-body-secondary">DP 游玩次数: </small>{pdata()!.player.play_num_dp}</h6>
                  <h6><small class="text-body-secondary">DP段位: </small>{danNames[pdata()!.player.grade_id_dp]}</h6>
                  <h6><small class="text-body-secondary">最后游玩的版本号:</small> {pdata()!.version}</h6>
                </div>
              </div>
              <div class="card bg-dark-subtle mb-3">
                <div class="card-body">
                  <h5 class="card-title">对手设置</h5>
                  <div class="form-check form-switch mb-3">
                    <input class="form-check-input" type="checkbox" role="switch" id="rivalEnabled" checked={rivalInfo()?.enabled} onchange={(e) => setRivalState(e.target.checked)} />
                    <label class="form-check-label ms-2" for="rivalEnabled">启用 RIVAL 功能</label>
                  </div>
                  <Show when={rivalInfo()?.spRivals.length}>
                    <table class="table">
                      <caption class="caption-top">SP 对手列表</caption>
                      <thead>
                        <tr>
                          <th>RIVAL ID</th>
                          <th>DJ NAME</th>
                          <th>SP 段位</th>
                          <th>DP 段位</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody style="vertical-align: middle">
                        {
                          rivalInfo()?.spRivals.map(v => (
                            <tr>
                              <td>{v.infinitas_id}</td>
                              <td>{v.djname}</td>
                              <td>{danNames[v.grade_id_sp]}</td>
                              <td>{danNames[v.grade_id_dp]}</td>
                              <td>
                                <button class="btn btn-danger" onclick={() => deleteRival(v.infinitas_id, 0)}>移除对手</button>
                              </td>
                            </tr>
                          ))
                        }
                        <tr></tr>
                      </tbody>
                    </table>
                  </Show>
                  <Show when={rivalInfo()?.dpRivals.length}>
                    <table class="table">
                      <caption class="caption-top">DP 对手列表</caption>
                      <thead>
                        <tr>
                          <th>RIVAL ID</th>
                          <th>DJ NAME</th>
                          <th>SP 段位</th>
                          <th>DP 段位</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody style="vertical-align: middle">
                        {
                          rivalInfo()?.dpRivals.map(v => (
                            <tr>
                              <td>{v.infinitas_id}</td>
                              <td>{v.djname}</td>
                              <td>{danNames[v.grade_id_sp]}</td>
                              <td>{danNames[v.grade_id_dp]}</td>
                              <td>
                                <button class="btn btn-danger" onclick={() => deleteRival(v.infinitas_id, 1)}>移除对手</button>
                              </td>
                            </tr>
                          ))
                        }
                        <tr></tr>
                      </tbody>
                    </table>
                  </Show>
                  <div class="input-group mb-3">
                    <span class="input-group-text">添加对手</span>
                    <input type="text" class="form-control" placeholder="RIVAL ID" id="rivalInput" ref={rivalInput!} />
                    <button class="btn btn-success" type="button" onclick={() => addRival(rivalInput.value, 0)}>添加到 SP</button>
                    <button class="btn btn-primary" type="button" onclick={() => addRival(rivalInput.value, 1)}>添加到 DP</button>
                  </div>


                </div>
              </div>
            </div>
            <div class="col">
              <Customize sCustomizeSetting={[customizeSetting, setCustomizeSetting]} saveCustomize={saveCustomize}></Customize>
            </div>
          </div>
        </div >
      </Show>
      <footer>
        <div class="container">Powered by Laochan</div>
      </footer>
    </>
  )
}

export default App
