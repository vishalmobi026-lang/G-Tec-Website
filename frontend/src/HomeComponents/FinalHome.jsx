import React from "react";
import { motion } from "framer-motion";
import { 
  Type, ImageIcon, Plus, Hexagon, Layers, Palette, Settings, 
  MousePointer2, ChevronDown, Share2, GripVertical, Eye, Frame, Square,
  AlignLeft, AlignCenter, AlignRight, Link2   
} from "lucide-react";

export default function CreativeWorkflowSection() {
    const img = ["/cr1.jpg", "/cr2.jpg", "/cr3.jpg"];
    
  return (
    <section className="relative z-10 -mb-50 w-full bg-white py-24 px-6 md:px-12 lg:px-24 font-sans text-center rounded-b-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
      
      <div className="max-w-7xl mx-auto space-y-16">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex flex-col items-center gap-6"
        >
          <h1 className="text-5xl md:text-5xl font-clash text-black tracking-tighter leading-none max-w-4xl mx-auto">
            Take your <span className="text-blue-600">Creative</span> workflow to the next level
          </h1>

          <p className="text-xl md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-normal">
            Effortlessly create stunning visual content with our integrated suite of design tools. Enhance collaboration and speed up delivery times across your entire team.
          </p>

          <button className="relative group bg-blue-800 text-white text-xl font-bold px-10 py-4.5 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(29,112,242,0.3)] hover:shadow-[0_0_30px_rgba(29,112,242,0.5)]">
            <span className="relative z-10">Get start now</span>
          </button>
        </motion.div>

        <section className="w-full bg-white py-2 px-4 md:px-12 font-sans overflow-hidden">
          <div className="max-w-7xl mx-auto">
            
            <motion.div 
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "circOut" }}
              className="relative rounded-[3rem] p-2 shadow-2xl"
            >
              <div className="bg-white rounded-t-[2.5rem] border-b border-gray-100 px-6 py-4 flex items-center justify-between shadow-sm relative z-20">
                <div className="flex items-center gap-3">
                  <img src="/logo1.webp" alt="Logo" className="w-16 h-11 p-2 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-200"/>
                  <span className="font-bold text-gray-800 text-lg hidden md:block">G-TEC Nagercoil</span>
                </div>

                <div className="flex items-center gap-2 bg-gray-50 px-5 py-2.5 rounded-full border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                  <div className="w-6 h-6 rounded-full bg-linear-to-tr from-purple-500 to-pink-500 border-2 border-white shadow-sm"></div>
                  <span className="text-sm font-semibold text-gray-700">Creative Flow UI</span>
                  <ChevronDown size={16} className="text-gray-400" />
                </div>

                <div className="flex items-center gap-5">
                  <div className="flex space-x-3">
                    {img.map((imagePath, index) => (
                      <img 
                        key={index} 
                        src={imagePath} 
                        alt={`Avatar ${index}`}
                        className="w-9 h-9 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500 shadow-sm relative"
                        style={{ zIndex: 40 - (index * 10) }} 
                      />
                    ))}
                    <div className="w-9 h-9 rounded-full border-2 border-white bg-blue-50 text-blue-600 flex items-center justify-center text-[11px] font-bold shadow-sm relative z-10">+5</div>
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-200 transition-colors">
                    <Share2 size={16} /> Share
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-b-[2.5rem] flex flex-col md:flex-row min-h-[650px] overflow-hidden">
                
                <div className="flex shrink-0 border-r border-gray-100 bg-white z-10">
                  
                  <div className="w-16 border-r border-gray-100 p-3 flex flex-col items-center gap-5 bg-white">
                    {[MousePointer2, Type, ImageIcon, Hexagon, Layers, Palette].map((Icon, i) => (
                      <div key={i} className={`p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center ${i === 0 ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-gray-400 hover:bg-gray-50 hover:text-blue-600'}`}>
                        <Icon size={20} strokeWidth={2.5} />
                      </div>
                    ))}
                    <div className="mt-auto p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors">
                      <Settings size={20} strokeWidth={2.5} />
                    </div>
                  </div>

                  <div className="w-48 p-4 flex flex-col gap-6 bg-[#fafafa] border-white">
                    
                    <div>
                      <div className="flex items-center justify-between text-gray-800 mb-2 font-bold text-[11px] uppercase tracking-wider">
                        <div className="flex items-center gap-1.5 cursor-pointer hover:text-blue-600 transition-colors">
                          <ChevronDown size={14} />
                          <span>Pages</span>
                        </div>
                        <Plus size={14} className="text-gray-400 hover:text-gray-800 cursor-pointer transition-colors" />
                      </div>
                      <div className="pl-5 space-y-1 text-sm font-semibold text-gray-500">
                        <div className="text-blue-600 bg-blue-50 py-1.5 px-3 rounded-lg cursor-pointer">Page 1</div>
                        <div className="py-1.5 px-3 hover:bg-gray-200/50 rounded-lg cursor-pointer transition-colors">Page 2</div>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 text-gray-800 mb-2 font-bold text-[11px] uppercase tracking-wider cursor-pointer hover:text-blue-600 transition-colors">
                        <ChevronDown size={14} />
                        <span>Layers</span>
                      </div>
                      
                      <div className="space-y-0.5 text-sm font-semibold text-gray-600">
                        <div className="flex items-center gap-3 p-2 hover:bg-gray-200/50 rounded-lg cursor-pointer transition-colors">
                          <Frame size={14} className="text-gray-400" />
                          <span>Frame</span>
                        </div>
                        <div className="flex items-center gap-3 p-2 hover:bg-gray-200/50 rounded-lg cursor-pointer transition-colors">
                          <Square size={14} className="text-gray-400" />
                          <span>Rectangle</span>
                        </div>
                        <div className="flex items-center gap-3 p-2 hover:bg-gray-200/50 rounded-lg cursor-pointer transition-colors">
                          <Type size={14} className="text-gray-400" />
                          <span>Text here</span>
                        </div>
                        <div className="flex items-center gap-3 p-2 hover:bg-gray-200/50 rounded-lg cursor-pointer transition-colors">
                          <ImageIcon size={14} className="text-gray-400" />
                          <span>Images</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                <div className="flex-1 bg-gray-50 relative overflow-hidden flex flex-col">
                  
                  <div className="w-full bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between z-20 shadow-sm">
                    <div className="flex items-center gap-2 text-gray-700 hover:text-blue-600 cursor-pointer transition-colors">
                      <span className="text-sm font-semibold tracking-wide">Landing_page_design_02</span>
                      <ChevronDown size={14} className="text-gray-400" />
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="flex -space-x-2">
                         <div className="w-7 h-7 rounded-full border-2 border-white bg-pink-500"></div>
                         <div className="w-7 h-7 rounded-full border-2 border-white bg-purple-500"></div>
                         <div className="w-7 h-7 rounded-full border-2 border-white bg-blue-500"></div>
                       </div>
                       <button className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors">
                         <Plus size={14} />
                       </button>
                       <span className="text-sm font-semibold text-gray-400 border-l border-gray-200 pl-4">124%</span>
                    </div>
                  </div>

                  <div className="relative flex-1 w-full flex items-center justify-center bg-[#f8f9fa] overflow-hidden">
                    <div 
                      className="absolute inset-0 opacity-[0.15]" 
                      style={{ backgroundImage: `radial-gradient(#9ca3af 1px, transparent 1px)`, backgroundSize: '24px 24px' }}
                    ></div>

                    <motion.div 
                      animate={{ 
                        x: [-80, 120, -20, -80],
                        y: [-40, 60, 120, -40]
                      }}
                      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute z-50 pointer-events-none drop-shadow-xl"
                    >
                      <MousePointer2 className="fill-blue-600 text-white stroke-[1.5]" size={36} />
                      <div className="ml-5 mt-1 bg-blue-600 text-white text-[11px] px-3 py-1.5 rounded-md shadow-lg font-bold tracking-wide">
                        Sofia Designer
                      </div>
                    </motion.div>

                    <div className="relative group scale-100 md:scale-110">
                      <div className="w-80 h-70 border-2 border-blue-500 flex items-center justify-center relative overflow-hidden bg-white shadow-xl">
                         <img 
                           src={"/vcc.jpg"} 
                           className="absolute inset-0 w-full h-full object-cover"
                           alt="Crafting Future"
                         />
                         <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                           <h3 className="text-white text-5xl font-black text-center tracking-tighter leading-[0.9] relative z-10 drop-shadow-xl">
                             CRAFTING<br/>FUTURE
                           </h3>
                         </div>
                      </div>

                      <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-blue-600 rounded-sm shadow-sm"></div>
                      <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-blue-600 rounded-sm shadow-sm"></div>
                      <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-blue-600 rounded-sm shadow-sm"></div>
                      <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-blue-600 rounded-sm shadow-sm"></div>
                      
                      <div className="absolute top-1/2 -left-1.5 w-3 h-3 bg-white border-2 border-blue-600 rounded-sm shadow-sm -translate-y-1/2"></div>
                      <div className="absolute top-1/2 -right-1.5 w-3 h-3 bg-white border-2 border-blue-600 rounded-sm shadow-sm -translate-y-1/2"></div>
                      <div className="absolute -top-1.5 left-1/2 w-3 h-3 bg-white border-2 border-blue-600 rounded-sm shadow-sm -translate-x-1/2"></div>
                      <div className="absolute -bottom-1.5 left-1/2 w-3 h-3 bg-white border-2 border-blue-600 rounded-sm shadow-sm -translate-x-1/2"></div>
                    </div>

                  </div>
                </div>

                <div className="w-full md:w-64 border-l border-gray-200 bg-[#fafafa] flex flex-col text-sm z-10 shrink-0 overflow-y-auto">
                  
                  <div className="flex items-center justify-between p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-2 text-gray-800">
                      <span className="font-semibold text-[13px]">Frame</span>
                      <ChevronDown size={14} className="text-gray-500" />
                    </div>
                  </div>

                  <div className="p-4 border-b border-gray-200 flex flex-col gap-5">
                    <div className="flex items-center justify-between text-gray-400">
                      <div className="flex gap-2">
                        <div className="p-1 hover:bg-gray-200 hover:text-gray-800 rounded cursor-pointer transition-colors"><AlignLeft size={16} /></div>
                        <div className="p-1 hover:bg-gray-200 hover:text-gray-800 rounded cursor-pointer transition-colors"><AlignCenter size={16} /></div>
                        <div className="p-1 hover:bg-gray-200 hover:text-gray-800 rounded cursor-pointer transition-colors"><AlignRight size={16} /></div>
                      </div>
                      <div className="w-px h-4 bg-gray-300"></div>
                      <div className="flex gap-2">
                        <div className="p-1 hover:bg-gray-200 hover:text-gray-800 rounded cursor-pointer transition-colors"><AlignLeft size={16} className="-rotate-90" /></div>
                        <div className="p-1 hover:bg-gray-200 hover:text-gray-800 rounded cursor-pointer transition-colors"><AlignCenter size={16} className="-rotate-90" /></div>
                        <div className="p-1 hover:bg-gray-200 hover:text-gray-800 rounded cursor-pointer transition-colors"><AlignRight size={16} className="-rotate-90" /></div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3 flex-1 group">
                        <span className="text-gray-400 text-xs font-semibold group-hover:text-gray-800 transition-colors cursor-ew-resize">X</span>
                        <input type="text" defaultValue="144" className="w-full bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 outline-none text-gray-800 text-[13px] font-medium" />
                      </div>
                      <div className="flex items-center gap-3 flex-1 group">
                        <span className="text-gray-400 text-xs font-semibold group-hover:text-gray-800 transition-colors cursor-ew-resize">Y</span>
                        <input type="text" defaultValue="256" className="w-full bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 outline-none text-gray-800 text-[13px] font-medium" />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border-b border-gray-200 flex flex-col gap-4">
                    <span className="font-bold text-[10px] text-gray-400 uppercase tracking-widest">Layout</span>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 w-20 group">
                        <span className="text-gray-400 text-xs font-semibold group-hover:text-gray-800 transition-colors cursor-ew-resize">W</span>
                        <input type="text" defaultValue="1280" className="w-full bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 outline-none text-gray-800 text-[13px] font-medium" />
                      </div>
                      
                      <div className="p-1 hover:bg-gray-200 text-gray-400 hover:text-gray-800 rounded cursor-pointer transition-colors">
                        <Link2 size={14} />
                      </div>

                      <div className="flex items-center gap-3 w-20 group">
                        <span className="text-gray-400 text-xs font-semibold group-hover:text-gray-800 transition-colors cursor-ew-resize">H</span>
                        <input type="text" defaultValue="720" className="w-full bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 outline-none text-gray-800 text-[13px] font-medium" />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border-b border-gray-200 flex flex-col gap-4">
                    <span className="font-bold text-[10px] text-gray-400 uppercase tracking-widest">Appearance</span>
                    
                    <div className="flex items-center justify-between group">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-[3px] bg-blue-600 border border-gray-200 cursor-pointer"></div>
                        <span className="text-gray-600 text-[13px] font-medium cursor-pointer">Fill</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-800 text-[13px] font-medium">100%</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          </div>
        </section>

      </div>
    </section>
  );
}