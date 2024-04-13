import { Signal, createSignal } from "solid-js"
import './CustomizeSelector.css'
import { PlayerCustomizeSetting } from "../api";

export default function ({ type, values, text, signal, other }: { type: number, values: string[], text: string, signal: Signal<PlayerCustomizeSetting>, other: boolean }) {
    let [customize, setCustomize] = signal;
    const id = "customize-select-" + type;

    const selected = () => {
        if (other) {
            return customize().other_customize.find(v => v.item_category == type)!.item_id;
        }

        const r = customize().customize.find(v => v.item_category == type)!.item_id;
        return r;
    }

    let [s, ss] = createSignal(selected());

    const setSelected = (v: string) => {
        const c = customize();

        if (other) {
            c.other_customize.find(v => v.item_category == type)!.item_id = v;
        } else {
            c.customize.find(v => v.item_category == type)!.item_id = v;
        }

        setCustomize(c);
        ss(v);
    }

    return (
        <div class="selector-container">
            <div>
                <img src={'images/' + s() + '.png'} />
                <label class="my-2" for={id}>{text}</label>
                <select class="form-select" id={id} value={s()} onchange={(e) => setSelected(e.target.value)}>
                    {values.map(v => (
                        <option value={v}>{v}</option>
                    ))}
                </select>
            </div>
        </div>
    )
}
