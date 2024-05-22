from pydantic import BaseModel
from typing import Dict
import json
import copy

# 假设上面的类定义已经给出
class DataIn(BaseModel):
    re: int
    ac: int
    nxpassed: int
    result: str
    nsample: int

class DataIn2(BaseModel):
    re2: int
    ac2: int
    nxpassed2: int
    result2: str
    nsample2: int

class TwoStepsData(BaseModel):
    onestep: DataIn
    twostep: DataIn2

class SampleData(BaseModel):
    onestep: DataIn
    twostep: TwoStepsData

class GameData(BaseModel):
    use_twosteps: bool
    sampledata: Dict[int, SampleData]

class GroupData(BaseModel):
    luosiding: GameData
    toycar: GameData
    phone: GameData

class DataFrame(BaseModel):
    groups: Dict[str, GroupData]

# 确保每个模型至少有一个实例的数据
data_in_example = DataIn(re=-1, ac=-1, nxpassed=-1, result="", nsample=-1)
data_in2_example = DataIn2(re2=-1, ac2=-1, nxpassed2=-1, result2="", nsample2=-1)
two_steps_data_example = TwoStepsData(onestep=data_in_example, twostep=data_in2_example)
sample_data_example = SampleData(onestep=data_in_example, twostep=two_steps_data_example)
game_data_example = GameData(use_twosteps=False, sampledata={i: copy.deepcopy(sample_data_example) for i in range(21)})
group_data_example = GroupData(luosiding=game_data_example, toycar=game_data_example, phone=game_data_example)

# 创建DataFrame实例
data_frame_example = DataFrame(groups={'//##placeholder##//': group_data_example})

# 将DataFrame转换为JSON字符串
json_content = data_frame_example.dict()

# 将JSON字符串写入文件
# with open('./server/assets/results.json', 'w') as file:
#     file.write(json_content)
if __name__ == "__main__":
# 或者直接使用json.dump方法，它将字典转换为JSON并写入文件
    with open('./server/assets/results.json', 'w') as file:
        json.dump(json_content, file, indent=4)