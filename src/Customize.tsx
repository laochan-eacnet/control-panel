import { Signal } from "solid-js";
import CustomizeSelector from "./components/CustomizeSelector"
import { bgms, customize, customizeText, otherCustomize, otherCustomizeText, results } from './data'
import { PlayerCustomizeSetting } from "./api";

import './Customize.css';

export default function ({ sCustomizeSetting, saveCustomize }: {
    sCustomizeSetting: Signal<PlayerCustomizeSetting | undefined>,
    saveCustomize: () => Promise<void>,
}) {
    let bitsInput: HTMLInputElement,
        ticketInput: HTMLInputElement,
        freeTicketInput: HTMLInputElement,
        ldiscInput: HTMLInputElement;

    const [customizeSetting, setCustomizeSetting] = sCustomizeSetting;
    const saveCustomizeWrapped = () => {
        const c = customizeSetting()!;
        c.items_count.bit = parseInt(bitsInput.value);
        c.items_count.infinitas_ticket = parseInt(ticketInput.value);
        c.items_count.infinitas_ticket_free = parseInt(freeTicketInput.value);
        c.items_count.ldisc = parseInt(ldiscInput.value);

        saveCustomize();
    };

    return (
        <>
            <div class="card bg-dark-subtle customize">
                <div class="card-body">
                    <h5 class="card-title">自定义</h5>
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
                    <div class="mb-3">
                        <CustomizeSelector type={12} values={results} text="结算背景图" other={false} signal={[customizeSetting, setCustomizeSetting] as Signal<PlayerCustomizeSetting>}></CustomizeSelector>
                    </div>
                    <hr />
                    <h5 class="card-title mb-3">物品数量</h5>
                    <div class="row">
                        <div class="col">
                            <div class="input-group mb-3">
                                <span class="input-group-text">BITS</span>
                                <input type="number" class="form-control" value={customizeSetting()?.items_count.bit} ref={bitsInput!} />
                            </div>
                        </div>
                        <div class="col">
                            <div class="input-group mb-3">
                                <span class="input-group-text">付费票</span>
                                <input type="number" class="form-control" value={customizeSetting()?.items_count.infinitas_ticket} ref={ticketInput!} />
                            </div>
                        </div>
                        <div class="col">
                            <div class="input-group mb-3">
                                <span class="input-group-text">免费票</span>
                                <input type="number" class="form-control" value={customizeSetting()?.items_count.infinitas_ticket_free} ref={freeTicketInput!} />
                            </div></div>
                        <div class="col">
                            <div class="input-group mb-3">
                                <span class="input-group-text">LDisc</span>
                                <input type="number" class="form-control" value={customizeSetting()?.items_count.ldisc} ref={ldiscInput!} />
                            </div>
                        </div>
                    </div>
                    <button onclick={saveCustomizeWrapped} class="btn btn-primary w-100">保存设置</button>
                </div>
            </div>
        </>
    )
}