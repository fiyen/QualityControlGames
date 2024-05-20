interface DataIn {
    re: number;
    ac: number;
    nxpassed: number;
    result: string;
    nsample: number
  }
  
  interface DataIn2 {
    re2: number;
    ac2: number;
    nxpassed2: number;
    result2: string;
    nsample2: number
  }
  
  interface TwoStepsData {
    onestep: DataIn;
    twostep: DataIn2;
  }
  
  interface SampleData {
    onestep: DataIn;
    twostep: TwoStepsData;
  }
  
  interface GameData {
    use_twosteps: boolean;
    sampledata: { [key: number]: SampleData };
  }
  
  interface GroupData {
    luosiding: GameData;
    toycar: GameData;
    phone: GameData;
  }

  interface DataFrame {
    groups: { [key: string]: GroupData };
  }

  const getDataTemplate = () => {
    const data_in_example = { re: -1, ac: -1, nsample: -1, nxpassed: -1, result: "" };
    const data_in2_example = { re2: -1, ac2: -1, nsample2: -1, nxpassed2: -1, result2: "" };
    const two_steps_data_example = { onestep: { ...data_in_example }, twostep: { ...data_in2_example } };
    const sample_data_example = { onestep: { ...data_in_example }, twostep: { ...two_steps_data_example } };
    const game_data_example = {
      use_twosteps: false,
      sampledata: {} // 初始为空对象
    };
  
    // 使用循环填充sampledata对象
    for (let i = 1; i <= 200; i++) {
      game_data_example.sampledata[i] = JSON.parse(JSON.stringify(sample_data_example));
    }
  
    const group_data_example = { luosiding: { ...game_data_example }, toycar: { ...game_data_example }, phone: { ...game_data_example } };
    return group_data_example;
  }
  
export { getDataTemplate };
export type { DataFrame };

