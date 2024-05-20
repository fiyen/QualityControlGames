import ProdCard from './ProdCard'
import { useLocation } from 'react-router-dom';
import React, { useState, useEffect, useContext } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch"
import './prodcard.css'
import AuthContext from './AuthContext';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
 
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { toast, ToastContainer } from 'react-toastify';
import { getDataTemplate, DataFrame } from './initData'
import Dropdown, { Option } from './dropdown'
import 'react-toastify/dist/ReactToastify.css';

let data: DataFrame

const FormSchema = z.object({
    ac: z.number().min(0, {
        message: "值最小为0"
    }).int({message: "请输入整数"}),
    re: z.number().min(1, {
        message: "值最小为1"
    }).int({
        message: "请输入整数"
    }),
    result: z.union([
        z.literal("合格"),
        z.literal("不合格"),
        z.literal("二次检验")
      ]).refine(value => value === "合格" || value === "不合格" || value === "二次检验", {
        message: "输入应该是 '合格' 或 '不合格'.",
        path: ["result"]
      }),
    nsample: z.number().min(0, {
        message: "值最小为0"
      }).int({message: "请输入整数"}),
    nxpassed: z.number().min(0, {
        message: "值最小为0"
      }).int({message: "请输入整数"}),
  }).refine(data => data.re > data.ac, 
    {message: "Re必须大于Ac",
    path: ["re"]},
   ).refine(data => data.nsample > data.nxpassed,
    {message: "不合格品数不可能大于样本数",
    path: ['nsample']})

const FormSchema2 = z.object({
    ac2: z.number().min(0, {
        message: "值最小为0"
    }).int({message: "请输入整数"}),
    re2: z.number().min(1, {
        message: "值最小为1"
    }).int({
        message: "请输入整数"
    }),
    result2: z.union([
        z.literal("合格"),
        z.literal("不合格"),
      ]).refine(value => value === "合格" || value === "不合格", {
        message: "输入应该是 '合格' 或 '不合格'.",
        path: ["result2"]
      }),
    nsample2: z.number().min(0, {
        message: "值最小为0"
      }).int({message: "请输入整数"}),
    nxpassed2: z.number().min(0, {
        message: "值最小为0"
      }).int({message: "请输入整数"}),
  }).refine(data => data.re2 > data.ac2, 
    {message: "Re必须大于Ac",
    path: ["re2"]},
   ).refine(data => data.nsample2 > data.nxpassed2,
    {message: "不合格品数不可能大于样本数",
    path: ['nsample2']})

interface Prod {
    background: string;
    quality: string;
  }

interface IconBackground {
    [key: string]: string;
}

const iconBackgrd: IconBackground = {
    "玩具汽车": "assets/game2-toycar-part.png",
    "螺丝钉": "assets/game1-luosiding-part.png",
    "手机屏幕": "assets/game3-phone-part.png"
}

const AQL: IconBackground = {
    "玩具汽车": `${import.meta.env.VITE_AQL_toycar}`,
    "螺丝钉": `${import.meta.env.VITE_AQL_luosiding}`,
    "手机屏幕": `${import.meta.env.VITE_AQL_phone}`
}

const prodNumber: IconBackground = {
    "玩具汽车": `${import.meta.env.VITE_N_toycar}`,
    "螺丝钉": `${import.meta.env.VITE_N_luosiding}`,
    "手机屏幕": `${import.meta.env.VITE_N_phone}`
}

const prodLabel: IconBackground = {
    "玩具汽车": "toycar",
    "螺丝钉": "luosiding",
    "手机屏幕": "phone"
}

function ProdPage() {
    const { markVisited } = useContext(AuthContext);

    useEffect(() => {
      markVisited("ProdPage");
    }, [markVisited]);

    const [number, setNumber] = useState(0);
    const [showProd, setShowProd] = useState(false);
    const [prods, setProds] = useState<Prod[]>([]);
    const [batchs, setBatchs] = useState<Option[]>(Array.from({ length: 20 }, (_, index) => ({
                                                            value: `${index + 1}`,
                                                            label: `batch ${index + 1}`})));
    const [selectedBatch, setSelectedBatch] = useState<Option | null>(null)
    const [switchTwoStep, setSwitched] = useState(false)
    const location = useLocation();
    const { groupName, title } = location.state || {};

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
          ac: NaN,
          re: NaN,
          result: '',
          nxpassed: NaN
        },
      })
    const form2 = useForm<z.infer<typeof FormSchema2>>({
        resolver: zodResolver(FormSchema2),
        defaultValues: {
          ac2: NaN,
          re2: NaN,
          result2: '',
          nxpassed2: NaN
        },
      })
     
      function onSubmit(part_data: z.infer<typeof FormSchema>) {
        console.log("onSubmit");
        const fields = ['ac', 're', 'nsample', 'nxpassed', 'result'];
        const updateData = {
            groupName: groupName,
            gameTitle: prodLabel[title],
            batch: parseInt(selectedBatch.value),
            cway: switchTwoStep ? "twostep" : "onestep",
            updates: {}
        };
    
        fields.forEach(field => {
            updateData.updates[field] = part_data[field];
        });
    
        console.log("updateData", updateData);
        const url = `${import.meta.env.VITE_SERVER_URL}/save_partial_data`;
    
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData, null, 2),
        })
        .then(response => response.json())
        .then(result => {
            console.log("result:", result);
            toast.info(
                 `恭喜，"${groupName}"的第"${updateData.batch}"批的检验结果已成功保存。`,
            )})
        .catch(error => {
            console.error('Error saving data:', error);
            toast.info(
                `很遗憾，"${groupName}"的第"${updateData.batch}"批的检验结果未能成功保存，请稍后重试。`,
        )});
    }

    function onSubmit2(part_data: z.infer<typeof FormSchema2>) {
        console.log("onSubmit2")
        const fields2 = ['ac2', 're2', 'nsample2', 'nxpassed2', 'result2']
        const updateData = {
            groupName: groupName,
            gameTitle: prodLabel[title],
            batch: parseInt(selectedBatch.value),
            cway: "twostep",
            updates: {}
        };

        fields2.forEach(field => {
            updateData.updates[field] = part_data[field];
        });

        const url = `${import.meta.env.VITE_SERVER_URL}/save_partial_data`
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData, null, 2),
        })
        .then(response => response.json())
        .then(result => {
            console.log("result:", result);
            toast.info(
                 `恭喜，"${groupName}"的第"${selectedBatch.value}"批的检验结果已成功保存。`,
        )})
        .catch(error => {
            console.error('Error saving data:', error);
            // 可以在这里处理保存数据失败的情况
            toast.info(
                `很遗憾，"${groupName}"的第"${selectedBatch.value}"批的检验结果未能成功保存，请稍后重试。`,
        )});
    }

    function onSwitched(data: boolean) {
        setSwitched(data)
    }
    
    const genProds = () => {
        if (showProd) {
            setProds(
                Array.from({ length: number }, () => {
                    let quality;
                    if (parseFloat(AQL[title]) < 100) {
                        quality = Math.random();
                        while (quality < 0.5 || Math.random() > (1 - parseFloat(AQL[title]) / 100)) {
                            quality = Math.random();
                        }
                    } else {
                        const mean = parseFloat(AQL[title]) / 100;
                        const stdDev = 0.1; // 标准差取0.1
                        quality = Math.round(gaussianRandom(mean, stdDev) * 100) / 100; // 生成服从高斯分布的整数值
                    }
                    return { background: iconBackgrd[title], quality: quality.toFixed(2).toString() };
                })
            )
        }
    }
    
    // 生成服从均值为mean，标准差为stdDev的高斯分布随机数
    function gaussianRandom(mean: number, stdDev:number) {
        let u = 0, v = 0;
        while (u === 0) u = Math.random(); // 舍弃0
        while (v === 0) v = Math.random(); // 舍弃0
        return mean + stdDev * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    }

    // loadData 函数定义
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
        
            // TODO: 根据需求对data进行更多操作
            processResponse();
        } catch (error) {
            // 错误处理
            console.error('There was a problem with your fetch operation:', error);
        }
    }
    
    // 示范引入一个处理数据的函数
    function processResponse(): void {
        // 对数据进行处理的逻辑
        console.log("Data processing begins:");

        if (data.groups && !(groupName in data.groups)) {
            // 关键词不存在，创建新的groups值
            data.groups[groupName] = getDataTemplate();
        }

        // 更新检验参数
        const fields = ['ac', 're', 'nsample','nxpassed', 'result'];
        const fields2 = ['ac2', 're2', 'nsample2', 'nxpassed2', 'result2']
        if (switchTwoStep) {
            // 启动二次检验
            console.log("二次检验")
            const { onestep, twostep } = data.groups[groupName][prodLabel[title]].sampledata[parseInt(selectedBatch.value)].twostep;
            fields.forEach(field => {
                form.setValue(field, onestep[field]);
            });
            fields2.forEach(field => {
                form2.setValue(field, twostep[field]);
            });

        } else {
            // 启动一次检验
            console.log("一次检验")
            const onestep = data.groups[groupName][prodLabel[title]].sampledata[parseInt(selectedBatch.value)].onestep
            fields.forEach(field => {
                form.setValue(field, onestep[field])
            })

        }
        
        
    }

    const handleChange = (newValue) => {
        const newBatch = batchs.find(batch => batch.value === newValue);
        if (!newBatch) {
            setNumber(0);
            setProds([]);
            setShowProd(false);
            setSelectedBatch(null)
        } else if (selectedBatch !== newBatch) {
            setNumber(0);
            setProds([]);
            setSelectedBatch(newBatch);
            setShowProd(true);
        }
    };

    // useEffect 监听 selectedBatch 的变化
    useEffect(() => {
            if (selectedBatch) {
                loadData(); // 调用加载数据的函数
            }
        }, [selectedBatch, switchTwoStep]);

    return (
        <div>
            <div style={{display: "flex", justifyContent: "center"}}>
                <h1>{title} - 组名: {groupName}</h1>
            </div>
            <br/><hr/><br/>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "30vh"}}>
            {showProd && (<Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", flexWrap: "wrap"}}>
                    <FormField
                    control={form.control}
                    name="ac"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Ac</FormLabel>
                        <FormControl>
                            <Input type='number' {...field} onChange={e => field.onChange(parseInt(e.target.value))}/>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="re"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Re</FormLabel>
                        <FormControl>
                            <Input type='number' {...field} onChange={e => field.onChange(parseInt(e.target.value))}/>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="nsample"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>样本量</FormLabel>
                        <FormControl>
                            <Input type='number' {...field} onChange={e => field.onChange(parseInt(e.target.value))}/>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="nxpassed"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>不合格品数</FormLabel>
                        <FormControl>
                            <Input type='number' {...field} onChange={e => field.onChange(parseInt(e.target.value))}/>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="result"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Result（合格/不合格）</FormLabel>
                        <FormControl>
                            <Input placeholder='' {...field}/>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    </div>

                    <Button type="submit">提交结果</Button>
                </form>
                <ToastContainer/>
            </Form>)}
            {showProd && switchTwoStep &&(<Form {...form2}>
                <form onSubmit={form2.handleSubmit(onSubmit2)} className="w-2/3 space-y-6">
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", flexWrap: "wrap"}}>
                    <FormField
                    control={form2.control}
                    name="ac2"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Ac2</FormLabel>
                        <FormControl>
                            <Input type='number' {...field} onChange={e => field.onChange(parseInt(e.target.value))}/>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form2.control}
                    name="re2"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Re2</FormLabel>
                        <FormControl>
                            <Input type='number' {...field} onChange={e => field.onChange(parseInt(e.target.value))}/>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form2.control}
                    name="nsample2"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>样本量2</FormLabel>
                        <FormControl>
                            <Input type='number' {...field} onChange={e => field.onChange(parseInt(e.target.value))}/>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                     <FormField
                    control={form2.control}
                    name="nxpassed2"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>不合格品数2</FormLabel>
                        <FormControl>
                            <Input type='number' {...field} onChange={e => field.onChange(parseInt(e.target.value))}/>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form2.control}
                    name="result2"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Result2（合格/不合格）</FormLabel>
                        <FormControl>
                            <Input placeholder='' {...field}/>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    </div>

                    <Button type="submit">提交结果2</Button>
                </form>
            </Form>)}
            </div>
            {showProd && (
                <div>
                    <br/><hr/><br/>
                </div>
            )}
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", flexWrap: "wrap"}}>
                <div className="flex items-center space-x-4">
                    <p className="text-sm text-muted-foreground">批次</p>
                    <Dropdown
                        options={batchs}
                        value={selectedBatch}
                        onChange={handleChange}
                    />
                </div>
                {showProd &&
                (<div className="flex items-center space-x-2">
                    <Switch id="two-step-qc" onCheckedChange={onSwitched}/>
                    <Label htmlFor="two-step-qc">启动二次检验</Label>
                </div>)
                }
            </div>

            {showProd && (
                <div>
                    <br/><hr/><br/>
                </div>
            )}
            {showProd && (
            <div className='information'>
                <Label htmlFor='secret'>随机样品数量</Label>
                <Input 
                    type="number" 
                    placeholder="输入样本数量" 
                    id='number'
                    value={number} 
                    onChange={e => setNumber(parseInt(e.target.value))} 
                />
                <Button 
                    type='button'  
                    variant='outline' 
                    onClick={genProds} 
                >
                    生成样本
                </Button>
            </div>)}
            <div className="background">
                <div className="gallery">
                    {prods.map(
                        (card, index) => (
                            <ProdCard
                                key={index}
                                background={card.background}
                                quality={card.quality}
                            >

                            </ProdCard>
                        )
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProdPage