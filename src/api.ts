export interface PlayerCustomizeSetting {
    _id: string;
    customize: {
        item_id: string,
        item_category: number,
    }[];
    other_customize: {
        item_id: string,
        item_category: number,
    }[];
}

export interface Pdata {
    bit: Bit;
    dan: Dan;
    effector: Effector;
    mission: Mission;
    option: Option;
    player: Player;
    rival: Rival;
    stats: Stats;
    version: string;
}

export interface Bit {
    boost_expire_date: number;
    consume_bit: number;
    total_bit: number;
}

export interface Dan {
    dp: SPClass;
    sp: SPClass;
}

export interface SPClass {
    kind: Kind[];
}

export interface Kind {
    id: number;
}

export interface Effector {
    effect_type: number;
    filter: number;
    hi_eq: number;
    hi_mid_eq: number;
    low_eq: number;
    low_mid_eq: number;
    play_volume: number;
    vefx: number;
}

export interface Mission {
    frame_list: FrameList;
    mission_list: History;
}

export interface FrameList {
    frame0: Frame;
    frame1: Frame;
    frame2: Frame;
}

export interface Frame {
    expire_date: number;
}

export interface Option {
    anykey_dp: number;
    anykey_sp: number;
    auto_scrach_disp_type_dp: number;
    auto_scrach_disp_type_sp: number;
    autoscratch_dp: number;
    autoscratch_sp: number;
    classic_hispeed_dp: number;
    classic_hispeed_sp: number;
    disp_judge_dp: boolean;
    disp_judge_sp: boolean;
    enable_auto_adjust_dp: boolean;
    enable_auto_adjust_sp: boolean;
    fivekeys_dp: number;
    fivekeys_sp: number;
    floating_hispeed_dp: number;
    floating_hispeed_sp: number;
    gauge_disp_type_dp: number;
    gauge_disp_type_sp: number;
    gauge_dp: number;
    gauge_sp: number;
    ghost_score_dp: number;
    ghost_score_sp: number;
    ghost_type_dp: number;
    ghost_type_sp: number;
    graph_no_dp: number;
    graph_no_sp: number;
    graph_position: number;
    graph_score_type_dp: number;
    graph_score_type_sp: number;
    hidden_dp: number;
    hidden_sp: number;
    hispeed_dp: number;
    hispeed_sp: number;
    hispeed_type: number;
    judge_adjust_dp: number;
    judge_adjust_sp: number;
    judge_place_dp: number;
    judge_place_sp: number;
    key_config: KeyConfig;
    keyassist_dp: number;
    keyassist_sp: number;
    lane_brigntness_dp: number;
    lane_brigntness_sp: number;
    legacy_dp: number;
    legacy_sp: number;
    lift_dp: number;
    lift_length_dp: number;
    lift_length_sp: number;
    lift_sp: number;
    mirror_dp: number;
    mirror_dp_2p: number;
    mirror_sp: number;
    movie_type_dp: number;
    movie_type_sp: number;
    music_sort_type_dp: number;
    music_sort_type_sp: number;
    notes_disp_time_dp: number;
    notes_disp_time_sp: number;
    option_style_dp: number;
    option_style_sp: number;
    pacemaker_dp: number;
    pacemaker_sp: number;
    random_dp: number;
    random_dp_2p: number;
    random_sp: number;
    sd_length_dp: number;
    sd_length_sp: number;
    sd_type_dp: number;
    sd_type_sp: number;
    sub_graph_no_dp: number;
    sub_graph_no_sp: number;
    sudden_dp: number;
    sudden_sp: number;
    timing_disp_split_dp: number;
    timing_disp_split_sp: number;
    timing_type_dp: number;
    timing_type_sp: number;
}

export interface KeyConfig {
    sw_0: number;
    sw_1: number;
    sw_10: number;
    sw_11: number;
    sw_12: number;
    sw_13: number;
    sw_14: number;
    sw_15: number;
    sw_16: number;
    sw_17: number;
    sw_18: number;
    sw_19: number;
    sw_2: number;
    sw_20: number;
    sw_21: number;
    sw_22: number;
    sw_23: number;
    sw_24: number;
    sw_25: number;
    sw_26: number;
    sw_27: number;
    sw_28: number;
    sw_29: number;
    sw_3: number;
    sw_30: number;
    sw_31: number;
    sw_32: number;
    sw_33: number;
    sw_34: number;
    sw_35: number;
    sw_4: number;
    sw_5: number;
    sw_6: number;
    sw_7: number;
    sw_8: number;
    sw_9: number;
}

export interface Player {
    achievement_dp: number;
    achievement_sp: number;
    djname: string;
    grade_id_dp: number;
    grade_id_sp: number;
    infinitas_id: string;
    play_num_dp: number;
    play_num_sp: number;
    pref_id: number;
}

export interface Rival {
    challenge_crush_num_dp: number;
    challenge_crush_num_sp: number;
}

export interface Stats {
    dp: StatsDP;
    left: Side;
    right: Side;
    sp: SP;
}

export interface StatsDP {
    djpoint_hist: History;
    grade_hist: History;
    mrank_hist: History;
    play_time: DPPlayTime;
}

export interface History {
    [name: string]: {
        time: number;
        val: number;
    };
}

export interface DPPlayTime {
    hist: History;
    last_end: number;
    last_start: number;
    max: number;
    total: number;
}

export interface Side {
    ctrl_count: number;
    ctrl_hit: CtrlHit;
    ctrl_type: number;
}

export interface CtrlHit {
    sw_01: number;
    sw_02: number;
    sw_03: number;
    sw_04: number;
    sw_05: number;
    sw_06: number;
    sw_07: number;
    sw_08: number;
    sw_09: number;
    sw_10: number;
    sw_11: number;
    tt_mv: number;
}

export interface SP {
    djpoint_hist: History;
    grade_hist: History;
    mrank_hist: History;
    play_time: SPPlayTime;
}

export interface SPPlayTime {
    hist: History;
    last_end: number;
    last_start: number;
    max: number;
    total: number;
}


export class Api {
    constructor(
        private readonly apiBase: string,
    ) { }

    private async fetch(url: string, method: 'GET' | 'POST' | 'PUT' = 'GET', body?: BodyInit) {
        const result = await fetch(this.apiBase + url, {
            method,
            body,
            headers: {
                'Content-Type': 'application/json',
            }
        }).catch();

        return await result.json();
    }

    public getPdata(token: string): Promise<{ pdata: Pdata }> {
        return this.fetch('/p2d/pdata/' + token);
    }

    public getCustomizeSetting(token: string): Promise<{ customize: PlayerCustomizeSetting }> {
        return this.fetch('/p2d/customize/' + token);
    }

    public putCustomizeSetting(token: string, customize: PlayerCustomizeSetting) {
        return this.fetch('/p2d/customize/' + token, 'PUT', JSON.stringify(customize));
    }
}

export const api = new Api('/api');
