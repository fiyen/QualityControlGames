import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast, ToastContainer } from 'react-toastify';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import AuthContext from './AuthContext';
import React, { useEffect, useContext, useRef, useState } from 'react';
import { DataFrame } from '@/components/ui/initData'

// 创建data用于全局保存当前的统计情况
let data: DataFrame

interface DataIn {
  're': number;
  'ac': number;
  'nxpassed': number;
  'result': string;
  'nsample': number;
  're2': number;
  'ac2': number;
  'nxpassed2': number;
  'result2': string;
  'nsample2': number
}

const range = (start: number, end: number) => {
  return Array.from({ length: end - start + 1 }, (v, k) => k + start);
};

function StatsPage() {
  // 创建一个从1到20的数字数组
  const batches = range(1, 20);
  const gameTitles = ['luosiding', 'toycar', 'phone']
  const { markVisited } = useContext(AuthContext);

  const [groupNames, setGroupNames] = useState<string[]>([]); // 这现在是个状态
  const [isAutoRefresh, setIsAutoRefresh] = useState(false);
  let intervalId = useRef(null);

  async function loadData(): Promise<void> {
    try {
        const url = `${import.meta.env.VITE_SERVER_URL}/load_data`
        // 发起 fetch 请求
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
    }

        // 解析 JSON 数据
        data = await response.json();
        console.log('data', data)
        let loadedGroupNames = Object.keys(data.groups);
        loadedGroupNames = loadedGroupNames.filter((value) => value !== "//##placeholder##//")

        console.log("loadedGroupNames", loadedGroupNames)

        setGroupNames(loadedGroupNames)
        console.log('groupNames:', groupNames)
    
    } catch (error) {
        // 错误处理
        console.error('There was a problem with your fetch operation:', error);
    }
  }

  function getData(groupName: string, gameTitle: string, batch: number, cway: string): number | string {
    // 对数据进行处理的逻辑
    console.log("Data processing begins:");

    // 更新检验参数
    const fields = ['ac', 're', 'nsample','nxpassed', 'result'];
    const fields2 = ['ac2', 're2', 'nsample2', 'nxpassed2', 'result2']

    // 创建新值
    const newdata: DataIn = {
      re: -1,
      ac: -1,
      nxpassed: -1,
      result: '',
      nsample: -1,
      re2: -1,
      ac2: -1,
      nxpassed2: -1,
      result2: '',
      nsample2: -1
    };
    

    if (cway === "twostep") {
        // 启动二次检验
        const { onestep, twostep } = data.groups[groupName][gameTitle].sampledata[batch].twostep;
        fields.forEach(field => {
            newdata[field] = onestep[field];
        });
        fields2.forEach(field => {
          newdata[field] = twostep[field];
        });

    } else {
        // 启动一次检验
        const onestep = data.groups[groupName][gameTitle].sampledata[batch].onestep
        fields.forEach(field => {
          newdata[field] = onestep[field];
        })

    }
    return newdata
  }

  function initData() {
    const url = `${import.meta.env.VITE_SERVER_URL}/init_data`

    fetch(url, {
        method: 'GET' // 或 'POST' 或其他请求方法
        // 可以添加其他的请求配置，比如 headers 等
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
            toast.info(
              `恭喜，"${groupName}"的第"${selectedBatch.value}"批的检验结果已成功保存。`,
             )
        }
        // 这里不需要处理返回结果，可以直接结束
    })
    .catch(error => {
        console.error('Error in initiating data:', error);
    });
}

  function genMsg(groupName: string, gameTitle: string, batch: number, cway: string): string | Element {
      // 先进行一波判断（后续优化）todo:
      if (cway === 'onestep') {
        if (gameTitle === "toycar") {
          return "."
        }
      } else {
        if (gameTitle === 'luosiding') {
          return "."
        }
      }
      // 生成可供显示的字符串
      const newdata = getData(groupName, gameTitle, batch, cway);

      const result = newdata['result'];
      const result2 = newdata['result2'];

      if (result2 !== '') {
          if (result === '合格' && result2 === '合格') {
              return (<div>&#10004;&#10004;</div>);
          } else if (result === '不合格' && result2 === '不合格') {
              return (<div>&#10008;&#10008;</div>);
          } else if (result === '不合格' && result2 === '合格') {
              return (<div>&#10008;&#10004;</div>);
          } else {
              return "?"
          }
      } else {
          if (result === '合格') {
              return (<div>&#10004;</div>);
          } else if (result === '不合格') {
              return (<div>&#10008;</div>);
          }
      }

      return "-";
  }


  useEffect(() => {
    markVisited("StatsPage");
    return () => {
      // 清理函数，组件卸载时调用
      if (intervalId.current) clearInterval(intervalId.current);
    }
  }, [markVisited]);

  useEffect(() => {
    if (isAutoRefresh) {
      // 如果开启自动刷新，设置定时器每10秒调用一次loadData
      intervalId.current = setInterval(() => {
        loadData();
      }, 5000);
    } else {
      // 如果关闭自动刷新，清除定时器
      if (intervalId.current) clearInterval(intervalId.current);
    }

    // 当isAutoRefresh变化时重新执行此effect
    return () => {
      if (intervalId.current) clearInterval(intervalId.current);
    };
  }, [isAutoRefresh]);

  const toggleAutoRefresh = () => {
    setIsAutoRefresh(!isAutoRefresh);
  };

  return (
    <div style={{minHeight: "300vh"}}>
    <Tabs defaultValue="statistics" className="w-[1400px] h-[1000px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="statistics">STATISTICS</TabsTrigger>
        <TabsTrigger value="save/load">SAVE/LOAD</TabsTrigger>
      </TabsList>
      <TabsContent value="statistics">
        <Card>
          <CardHeader>
            <CardTitle>统计结果</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
          <Table>
            <TableCaption>
              <div className="flex items-center space-x-2 w-[300px]">
                <Switch id="two-step-qc" onCheckedChange={toggleAutoRefresh}/>
                <Label htmlFor="two-step-qc">自动刷新数据视图</Label>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button id="two-step-bt" onClick={initData} style={{ marginLeft: 'auto' }}>点击重置数据</Button>
                <ToastContainer/>
              </div>
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[10px]">组名</TableHead>
                <TableHead className="w-[5px]">产品</TableHead>
                {batches.map((i) => (
                  <TableHead key={`batch-${i}`}>{i}</TableHead>
                ))}
                {batches.map((i) => (
                  <TableHead key={`batch2-${i}`}>2-{i}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {groupNames.length > 0 && groupNames.map((group) => (
                gameTitles.map((title) => (
                  <TableRow>
                    <TableCell>{group.length > 3 ? `${group.charAt(0)}..${group.charAt(group.length - 1)}` : group}</TableCell>
                    <TableCell>{title}</TableCell>
                    {batches.map((batch) => (
                      <TableCell>{genMsg(group, title, batch, 'onestep')}</TableCell>
                    ))}
                    {batches.map((batch) => (
                      <TableCell>{genMsg(group, title, batch, 'twostep')}</TableCell>
                    ))}
                  </TableRow>
                ))
              ))}
            </TableBody>
          </Table>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="save/load">
        <Card>
          <CardHeader>
            <CardTitle>保存和读取</CardTitle>
            <CardDescription>
              点击保存可下载当前结果的json文件，点击上传将上传json文件，注意json必须是通过保存下载且未经更改的，否则会报错.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {/* <div className="space-y-1">
              <Label htmlFor="current">Current password</Label>
              <Input id="current" type="password" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="new">New password</Label>
              <Input id="new" type="password" />
            </div> */}
          </CardContent>
          {/* <CardFooter>
            <Button>Save password</Button>
          </CardFooter> */}
        </Card>
      </TabsContent>
    </Tabs>
    </div>
  )
}

export default StatsPage;
