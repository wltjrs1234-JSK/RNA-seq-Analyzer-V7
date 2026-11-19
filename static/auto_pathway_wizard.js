
// ======================================================================
// 10. Advanced Metabolic Engineering Auto Pathway Generator Wizard
//     (Central Carbon Backbone: Glycolysis + PPP + Fermentation + TCA Cycle + Target Biosynthesis Docking)
// ======================================================================

const CENTRAL_CARBON_BACKBONE_DATA = {"width": 1880, "height": 1050, "zones": [{"id": "zone_gsh_tca", "label": "TCA Cycle & Precursor Link (TCA 회로)", "x": 556, "y": 592, "w": 604, "h": 430, "color": "violet", "titlePos": "top-center"}, {"id": "zone_gsh_ppp", "label": "Pentose Phosphate Pathway (PPP)", "x": 1225, "y": 172, "w": 312, "h": 118, "color": "cyan", "titlePos": "top-left"}, {"id": "zone_gsh_ferm", "label": "Glycerol & Ethanol / Acetyl-CoA Fermentation (발효 및 전구체)", "x": 1225, "y": 335, "w": 312, "h": 595, "color": "rose", "titlePos": "top-left"}, {"id": "zone_gsh_glycolysis", "label": "Glycolysis (해당과정)", "x": 1543, "y": 24, "w": 297, "h": 906, "color": "blue", "titlePos": "top-left"}], "nodes": [{"id": "node_1786343940098", "label": "Succinate", "x": 780.1, "y": 635.8, "w": 84, "h": 26, "rx": 13, "type": "standard", "fillColor": "#ffffff", "strokeColor": "#94a3b8", "textColor": "#1e293b"}, {"id": "node_1786343943760", "label": "Succinyl-CoA", "x": 931, "y": 635.8, "w": 98, "h": 26, "rx": 13, "type": "standard", "fillColor": "#ffffff", "strokeColor": "#94a3b8", "textColor": "#1e293b"}, {"id": "node_1786343947690", "label": "Fumarate", "x": 714.5, "y": 714.9, "w": 84, "h": 26, "rx": 13, "type": "standard", "fillColor": "#ffffff", "strokeColor": "#94a3b8", "textColor": "#1e293b"}, {"id": "node_1786343951233", "label": "α-Ketoglutarate", "x": 1007, "y": 714.9, "w": 118, "h": 26, "rx": 13, "type": "standard", "fillColor": "#f8fafc", "strokeColor": "#64748b", "textColor": "#0f172a"}, {"id": "node_1786343955025", "label": "L-malate", "x": 714.5, "y": 832.7, "w": 84, "h": 26, "rx": 13, "type": "standard", "fillColor": "#ffffff", "strokeColor": "#94a3b8", "textColor": "#1e293b"}, {"id": "node_1786343958711", "label": "Isocitrate", "x": 1024, "y": 832.7, "w": 84, "h": 26, "rx": 13, "type": "standard", "fillColor": "#ffffff", "strokeColor": "#94a3b8", "textColor": "#1e293b"}, {"id": "node_1786343963016", "label": "Oxaloacetate", "x": 788.3, "y": 934.6, "w": 98, "h": 26, "rx": 13, "type": "standard", "fillColor": "#f8fafc", "strokeColor": "#64748b", "textColor": "#0f172a"}, {"id": "node_1786343969513", "label": "Citrate", "x": 953.2, "y": 934.6, "w": 84, "h": 26, "rx": 13, "type": "standard", "fillColor": "#f8fafc", "strokeColor": "#64748b", "textColor": "#0f172a"}, {"id": "node_1786343973825", "label": "Aspartate", "x": 583, "y": 935.2, "w": 84, "h": 26, "rx": 13, "type": "standard", "fillColor": "#f8fafc", "strokeColor": "#64748b", "textColor": "#0f172a"}, {"id": "node_1786344565923", "label": "6-PG", "x": 1443.9, "y": 221.6, "w": 84, "h": 26, "rx": 13, "type": "standard", "fillColor": "#ffffff", "strokeColor": "#94a3b8", "textColor": "#1e293b"}, {"id": "node_1786344572771", "label": "Ru5P", "x": 1268.6, "y": 221.6, "w": 84, "h": 26, "rx": 13, "type": "standard", "fillColor": "#ffffff", "strokeColor": "#94a3b8", "textColor": "#1e293b"}, {"id": "node_1786344465484", "label": "Acetate", "x": 1249, "y": 714.9, "w": 84, "h": 26, "rx": 13, "type": "standard", "fillColor": "#ffffff", "strokeColor": "#94a3b8", "textColor": "#1e293b"}, {"id": "node_1786344476268", "label": "Acetyl-CoA", "x": 1249, "y": 832.7, "w": 84, "h": 26, "rx": 13, "type": "standard", "fillColor": "#f8fafc", "strokeColor": "#64748b", "textColor": "#0f172a"}, {"id": "node_1786344482445", "label": "Pyruvate", "x": 1397.8, "y": 832.7, "w": 84, "h": 26, "rx": 13, "type": "standard", "fillColor": "#f8fafc", "strokeColor": "#64748b", "textColor": "#0f172a"}, {"id": "node_1786344486539", "label": "Acetaldehyde", "x": 1390.8, "y": 714.9, "w": 98, "h": 26, "rx": 13, "type": "standard", "fillColor": "#ffffff", "strokeColor": "#94a3b8", "textColor": "#1e293b"}, {"id": "node_1786344490523", "label": "Ethanol", "x": 1397.8, "y": 610.2, "w": 84, "h": 26, "rx": 13, "type": "standard", "fillColor": "#ffffff", "strokeColor": "#94a3b8", "textColor": "#1e293b"}, {"id": "node_1786344530348", "label": "Glycerol-3-P", "x": 1390.8, "y": 502.3, "w": 98, "h": 26, "rx": 13, "type": "standard", "fillColor": "#ffffff", "strokeColor": "#94a3b8", "textColor": "#1e293b"}, {"id": "node_1786344535115", "label": "Glycerol", "x": 1397.8, "y": 377.4, "w": 84, "h": 26, "rx": 13, "type": "standard", "fillColor": "#ffffff", "strokeColor": "#94a3b8", "textColor": "#1e293b"}, {"id": "node_1786344499435", "label": "PEP", "x": 1548.8, "y": 832.7, "w": 84, "h": 26, "rx": 13, "type": "standard", "fillColor": "#ffffff", "strokeColor": "#94a3b8", "textColor": "#1e293b"}, {"id": "node_1786344503883", "label": "2-PG", "x": 1697.8, "y": 832.7, "w": 84, "h": 26, "rx": 13, "type": "standard", "fillColor": "#ffffff", "strokeColor": "#94a3b8", "textColor": "#1e293b"}, {"id": "node_1786344508499", "label": "3-PG", "x": 1697.8, "y": 714.9, "w": 84, "h": 26, "rx": 13, "type": "standard", "fillColor": "#ffffff", "strokeColor": "#94a3b8", "textColor": "#1e293b"}, {"id": "node_1786344513292", "label": "1,3-DPG", "x": 1697.8, "y": 610.2, "w": 84, "h": 26, "rx": 13, "type": "standard", "fillColor": "#ffffff", "strokeColor": "#94a3b8", "textColor": "#1e293b"}, {"id": "node_1786344517931", "label": "GA3P", "x": 1697.8, "y": 502.3, "w": 84, "h": 26, "rx": 13, "type": "standard", "fillColor": "#ffffff", "strokeColor": "#94a3b8", "textColor": "#1e293b"}, {"id": "node_1786344525331", "label": "DHAP", "x": 1548.8, "y": 502.3, "w": 84, "h": 26, "rx": 13, "type": "standard", "fillColor": "#ffffff", "strokeColor": "#94a3b8", "textColor": "#1e293b"}, {"id": "node_1786344541067", "label": "F1,6P", "x": 1617.9, "y": 417.2, "w": 84, "h": 26, "rx": 13, "type": "standard", "fillColor": "#ffffff", "strokeColor": "#94a3b8", "textColor": "#1e293b"}, {"id": "node_1786344547988", "label": "F6P", "x": 1617.9, "y": 324.5, "w": 84, "h": 26, "rx": 13, "type": "standard", "fillColor": "#ffffff", "strokeColor": "#94a3b8", "textColor": "#1e293b"}, {"id": "node_1786344552940", "label": "G6P", "x": 1617.9, "y": 221.6, "w": 84, "h": 26, "rx": 13, "type": "standard", "fillColor": "#ffffff", "strokeColor": "#94a3b8", "textColor": "#1e293b"}, {"id": "node_1786344558603", "label": "Glucose", "x": 1619.1, "y": 139.2, "w": 84, "h": 26, "rx": 13, "type": "standard", "fillColor": "#f8fafc", "strokeColor": "#64748b", "textColor": "#0f172a"}, {"id": "node_1786344810871", "label": "Glucose", "x": 1619.1, "y": 49, "w": 84, "h": 26, "rx": 13, "type": "standard", "fillColor": "#f8fafc", "strokeColor": "#64748b", "textColor": "#0f172a"}], "arrows": [{"id": "arrow_1786344036800", "from": null, "to": null, "fromCoords": {"x": 1069, "y": 715.2}, "toCoords": {"x": 1024, "y": 664.2}, "type": "straight", "direction": "forward", "_calculated": {"startX": 1067.6767567258264, "startY": 713.7003242892698, "endX": 1031.9394596450422, "endY": 673.1980542643812, "cx": 1049.8081081854343, "cy": 693.4491892768256, "midX": 1049.8081081854343, "midY": 693.4491892768256, "ux": -0.6616216370868463, "uy": -0.7498378553650924, "nx": 0.7498378553650924, "ny": -0.6616216370868463}}, {"id": "arrow_1786344039784", "from": null, "to": null, "fromCoords": {"x": 1069, "y": 834.2}, "toCoords": {"x": 1069, "y": 743.2}, "type": "straight", "direction": "forward", "_calculated": {"startX": 1069, "startY": 832.2, "endX": 1069, "endY": 755.2, "cx": 1069, "cy": 793.7, "midX": 1069, "midY": 793.7, "ux": 0, "uy": -1, "nx": 1, "ny": 0}}, {"id": "arrow_1786344044919", "from": null, "to": null, "fromCoords": {"x": 993, "y": 934.2}, "toCoords": {"x": 1059, "y": 860.2}, "type": "straight", "direction": "forward", "_calculated": {"startX": 994.3312296939168, "startY": 932.7074091310631, "endX": 1051.0126218364992, "endY": 869.1555452136222, "cx": 1022.671925765208, "cy": 900.9314771723426, "midX": 1022.671925765208, "midY": 900.9314771723426, "ux": 0.6656148469584017, "uy": -0.746295434468511, "nx": 0.746295434468511, "ny": 0.6656148469584017}}, {"id": "arrow_1786344049173", "from": null, "to": null, "fromCoords": {"x": 884.2, "y": 946.6}, "toCoords": {"x": 953.2, "y": 946.6}, "type": "straight", "direction": "forward", "_calculated": {"startX": 886.2, "startY": 946.6, "endX": 941.2, "endY": 946.6, "cx": 913.7, "cy": 946.6, "midX": 913.7, "midY": 946.6, "ux": 1, "uy": 0, "nx": 0, "ny": 1}}, {"id": "arrow_1786344056274", "from": null, "to": null, "fromCoords": {"x": 771, "y": 861.2}, "toCoords": {"x": 827, "y": 939.2}, "type": "straight", "direction": "forward", "_calculated": {"startX": 772.1664135661828, "startY": 862.8246474671832, "endX": 820.0015186029032, "endY": 929.452115196901, "cx": 796.0839660845429, "cy": 896.1383813320422, "midX": 796.0839660845429, "midY": 896.1383813320422, "ux": 0.5832067830913987, "uy": 0.812323733591591, "nx": -0.812323733591591, "ny": 0.5832067830913987}}, {"id": "arrow_1786344059185", "from": null, "to": null, "fromCoords": {"x": 815, "y": 939.2}, "toCoords": {"x": 757, "y": 862.2}, "type": "straight", "direction": "forward", "_calculated": {"startX": 813.7966830876612, "startY": 937.6024930646538, "endX": 764.2199014740326, "endY": 871.7850416120777, "cx": 789.008292280847, "cy": 904.6937673383658, "midX": 789.008292280847, "midY": 904.6937673383658, "ux": -0.6016584561693825, "uy": -0.7987534676731458, "nx": 0.7987534676731458, "ny": -0.6016584561693825}}, {"id": "arrow_1786344063322", "from": null, "to": null, "fromCoords": {"x": 749, "y": 831.2}, "toCoords": {"x": 749, "y": 740.2}, "type": "straight", "direction": "forward", "_calculated": {"startX": 749, "startY": 829.2, "endX": 749, "endY": 752.2, "cx": 749, "cy": 790.7, "midX": 749, "midY": 790.7, "ux": 0, "uy": -1, "nx": 1, "ny": 0}}, {"id": "arrow_1786344065074", "from": null, "to": null, "fromCoords": {"x": 759, "y": 737.2}, "toCoords": {"x": 759, "y": 829.2}, "type": "straight", "direction": "forward", "_calculated": {"startX": 759, "startY": 739.2, "endX": 759, "endY": 817.2, "cx": 759, "cy": 778.2, "midX": 759, "midY": 778.2, "ux": 0, "uy": 1, "nx": -1, "ny": 0}}, {"id": "arrow_1786344068624", "from": null, "to": null, "fromCoords": {"x": 820, "y": 660.2}, "toCoords": {"x": 751, "y": 716.2}, "type": "straight", "direction": "forward", "_calculated": {"startX": 818.4470838112197, "startY": 661.4603377764014, "endX": 760.3174971326814, "endY": 708.637973341592, "cx": 789.3822904719506, "cy": 685.0491555589967, "midX": 789.3822904719506, "midY": 685.0491555589967, "ux": -0.7764580943901146, "uy": 0.6301688882006727, "nx": -0.6301688882006727, "ny": -0.7764580943901146}}, {"id": "arrow_1786344071123", "from": null, "to": null, "fromCoords": {"x": 761, "y": 716.2}, "toCoords": {"x": 828, "y": 663.2}, "type": "straight", "direction": "forward", "_calculated": {"startX": 762.5685662592377, "startY": 714.9591938546329, "endX": 818.5886024445736, "endY": 670.6448368722031, "cx": 790.5785843519056, "cy": 692.8020153634179, "midX": 790.5785843519056, "midY": 692.8020153634179, "ux": 0.7842831296188695, "uy": -0.6204030726835833, "nx": 0.6204030726835833, "ny": 0.7842831296188695}}, {"id": "arrow_1786344075686", "from": null, "to": null, "fromCoords": {"x": 865, "y": 650.2}, "toCoords": {"x": 933, "y": 650.2}, "type": "straight", "direction": "forward", "_calculated": {"startX": 867, "startY": 650.2, "endX": 921, "endY": 650.2, "cx": 894, "cy": 650.2, "midX": 894, "midY": 650.2, "ux": 1, "uy": 0, "nx": 0, "ny": 1}}, {"id": "arrow_1786344078231", "from": null, "to": null, "fromCoords": {"x": 935, "y": 640.2}, "toCoords": {"x": 863, "y": 640.2}, "type": "straight", "direction": "forward", "_calculated": {"startX": 933, "startY": 640.2, "endX": 875, "endY": 640.2, "cx": 904, "cy": 640.2, "midX": 904, "midY": 640.2, "ux": -1, "uy": 0, "nx": 0, "ny": -1}}, {"id": "arrow_1786344117813", "from": null, "to": null, "fromCoords": {"x": 665, "y": 947.2}, "toCoords": {"x": 780, "y": 947.2}, "type": "straight", "direction": "forward", "_calculated": {"startX": 667, "startY": 947.2, "endX": 768, "endY": 947.2, "cx": 717.5, "cy": 947.2, "midX": 717.5, "midY": 947.2, "ux": 1, "uy": 0, "nx": 0, "ny": 1}}, {"id": "arrow_1786344639387", "from": null, "to": null, "fromCoords": {"x": 1291, "y": 734.2}, "toCoords": {"x": 1291, "y": 830.2}, "type": "straight", "direction": "forward", "_calculated": {"startX": 1291, "startY": 736.2, "endX": 1291, "endY": 818.2, "cx": 1291, "cy": 777.2, "midX": 1291, "midY": 777.2, "ux": 0, "uy": 1, "nx": -1, "ny": 0}}, {"id": "arrow_1786344643875", "from": null, "to": null, "fromCoords": {"x": 1402, "y": 845.2}, "toCoords": {"x": 1334, "y": 845.2}, "type": "straight", "direction": "forward", "_calculated": {"startX": 1400, "startY": 845.2, "endX": 1346, "endY": 845.2, "cx": 1373, "cy": 845.2, "midX": 1373, "midY": 845.2, "ux": -1, "uy": 0, "nx": 0, "ny": -1}}, {"id": "arrow_1786344647315", "from": null, "to": null, "fromCoords": {"x": 1557, "y": 843.2}, "toCoords": {"x": 1484, "y": 843.2}, "type": "straight", "direction": "forward", "_calculated": {"startX": 1555, "startY": 843.2, "endX": 1496, "endY": 843.2, "cx": 1525.5, "cy": 843.2, "midX": 1525.5, "midY": 843.2, "ux": -1, "uy": 0, "nx": 0, "ny": -1}}, {"id": "arrow_1786344658586", "from": null, "to": null, "fromCoords": {"x": 1704, "y": 842.2}, "toCoords": {"x": 1633, "y": 842.2}, "type": "straight", "direction": "forward", "_calculated": {"startX": 1702, "startY": 842.2, "endX": 1645, "endY": 842.2, "cx": 1673.5, "cy": 842.2, "midX": 1673.5, "midY": 842.2, "ux": -1, "uy": 0, "nx": 0, "ny": -1}}, {"id": "arrow_1786344662827", "from": null, "to": null, "fromCoords": {"x": 1440, "y": 838.2}, "toCoords": {"x": 1440, "y": 740.2}, "type": "straight", "direction": "forward", "_calculated": {"startX": 1440, "startY": 836.2, "endX": 1440, "endY": 752.2, "cx": 1440, "cy": 794.2, "midX": 1440, "midY": 794.2, "ux": 0, "uy": -1, "nx": 1, "ny": 0}}, {"id": "arrow_1786344671577", "from": null, "to": null, "fromCoords": {"x": 1394, "y": 733.2}, "toCoords": {"x": 1330, "y": 733.2}, "type": "straight", "direction": "forward", "_calculated": {"startX": 1392, "startY": 733.2, "endX": 1342, "endY": 733.2, "cx": 1367, "cy": 733.2, "midX": 1367, "midY": 733.2, "ux": -1, "uy": 0, "nx": 0, "ny": -1}}, {"id": "arrow_1786344676420", "from": null, "to": null, "fromCoords": {"x": 1325, "y": 724.2}, "toCoords": {"x": 1391, "y": 724.2}, "type": "straight", "direction": "forward", "_calculated": {"startX": 1327, "startY": 724.2, "endX": 1379, "endY": 724.2, "cx": 1353, "cy": 724.2, "midX": 1353, "midY": 724.2, "ux": 1, "uy": 0, "nx": 0, "ny": 1}}, {"id": "arrow_1786344682028", "from": null, "to": null, "fromCoords": {"x": 1433, "y": 720.2}, "toCoords": {"x": 1433, "y": 636.2}, "type": "straight", "direction": "forward", "_calculated": {"startX": 1433, "startY": 718.2, "endX": 1433, "endY": 648.2, "cx": 1433, "cy": 683.2, "midX": 1433, "midY": 683.2, "ux": 0, "uy": -1, "nx": 1, "ny": 0}}, {"id": "arrow_1786344683403", "from": null, "to": null, "fromCoords": {"x": 1444, "y": 630.2}, "toCoords": {"x": 1444, "y": 719.2}, "type": "straight", "direction": "forward", "_calculated": {"startX": 1444, "startY": 632.2, "endX": 1444, "endY": 707.2, "cx": 1444, "cy": 669.7, "midX": 1444, "midY": 669.7, "ux": 0, "uy": 1, "nx": -1, "ny": 0}}, {"id": "arrow_1786344687705", "from": null, "to": null, "fromCoords": {"x": 1739, "y": 735.2}, "toCoords": {"x": 1739, "y": 829.2}, "type": "straight", "direction": "forward", "_calculated": {"startX": 1739, "startY": 737.2, "endX": 1739, "endY": 817.2, "cx": 1739, "cy": 777.2, "midX": 1739, "midY": 777.2, "ux": 0, "uy": 1, "nx": -1, "ny": 0}}, {"id": "arrow_1786344691843", "from": null, "to": null, "fromCoords": {"x": 1738, "y": 630.2}, "toCoords": {"x": 1738, "y": 712.2}, "type": "straight", "direction": "forward", "_calculated": {"startX": 1738, "startY": 632.2, "endX": 1738, "endY": 700.2, "cx": 1738, "cy": 666.2, "midX": 1738, "midY": 666.2, "ux": 0, "uy": 1, "nx": -1, "ny": 0}}, {"id": "arrow_1786344696913", "from": null, "to": null, "fromCoords": {"x": 1737, "y": 524.2}, "toCoords": {"x": 1737, "y": 605.2}, "type": "straight", "direction": "forward", "_calculated": {"startX": 1737, "startY": 526.2, "endX": 1737, "endY": 593.2, "cx": 1737, "cy": 559.7, "midX": 1737, "midY": 559.7, "ux": 0, "uy": 1, "nx": -1, "ny": 0}}, {"id": "arrow_1786344700081", "from": null, "to": null, "fromCoords": {"x": 1629, "y": 510.2}, "toCoords": {"x": 1699, "y": 510.2}, "type": "straight", "direction": "forward", "_calculated": {"startX": 1631, "startY": 510.2, "endX": 1687, "endY": 510.2, "cx": 1659, "cy": 510.2, "midX": 1659, "midY": 510.2, "ux": 1, "uy": 0, "nx": 0, "ny": 1}}, {"id": "arrow_1786344701267", "from": null, "to": null, "fromCoords": {"x": 1700, "y": 521.2}, "toCoords": {"x": 1626, "y": 521.2}, "type": "straight", "direction": "forward", "_calculated": {"startX": 1698, "startY": 521.2, "endX": 1638, "endY": 521.2, "cx": 1668, "cy": 521.2, "midX": 1668, "midY": 521.2, "ux": -1, "uy": 0, "nx": 0, "ny": -1}}, {"id": "arrow_1786344704749", "from": null, "to": null, "fromCoords": {"x": 1659, "y": 439.2}, "toCoords": {"x": 1595, "y": 501.2}, "type": "straight", "direction": "forward", "_calculated": {"startX": 1657.5635195544216, "startY": 440.591590431654, "endX": 1603.6188826734701, "endY": 492.8504574100758, "cx": 1630.5912011139458, "cy": 466.7210239208649, "midX": 1630.5912011139458, "midY": 466.7210239208649, "ux": -0.7182402227891738, "uy": 0.6957952158270121, "nx": -0.6957952158270121, "ny": -0.7182402227891738}}, {"id": "arrow_1786344706487", "from": null, "to": null, "fromCoords": {"x": 1657, "y": 443.2}, "toCoords": {"x": 1735, "y": 498.2}, "type": "straight", "direction": "forward", "_calculated": {"startX": 1658.634516267761, "startY": 444.3525435221391, "endX": 1725.1929023934345, "endY": 491.28473886716523, "cx": 1691.9137093305976, "cy": 467.8186411946522, "midX": 1691.9137093305976, "midY": 467.8186411946522, "ux": 0.8172581338804689, "uy": 0.5762717610695614, "nx": -0.5762717610695614, "ny": 0.8172581338804689}}, {"id": "arrow_1786344710979", "from": null, "to": null, "fromCoords": {"x": 1554, "y": 510.2}, "toCoords": {"x": 1483, "y": 510.2}, "type": "straight", "direction": "forward", "_calculated": {"startX": 1552, "startY": 510.2, "endX": 1495, "endY": 510.2, "cx": 1523.5, "cy": 510.2, "midX": 1523.5, "midY": 510.2, "ux": -1, "uy": 0, "nx": 0, "ny": -1}}, {"id": "arrow_1786344712430", "from": null, "to": null, "fromCoords": {"x": 1480, "y": 521.2}, "toCoords": {"x": 1551, "y": 521.2}, "type": "straight", "direction": "forward", "_calculated": {"startX": 1482, "startY": 521.2, "endX": 1539, "endY": 521.2, "cx": 1510.5, "cy": 521.2, "midX": 1510.5, "midY": 521.2, "ux": 1, "uy": 0, "nx": 0, "ny": 1}}, {"id": "arrow_1786344717584", "from": null, "to": null, "fromCoords": {"x": 1434, "y": 399.2}, "toCoords": {"x": 1434, "y": 509.2}, "type": "straight", "direction": "forward", "_calculated": {"startX": 1434, "startY": 401.2, "endX": 1434, "endY": 497.2, "cx": 1434, "cy": 449.2, "midX": 1434, "midY": 449.2, "ux": 0, "uy": 1, "nx": -1, "ny": 0}}, {"id": "arrow_1786344718907", "from": null, "to": null, "fromCoords": {"x": 1448, "y": 505.2}, "toCoords": {"x": 1448, "y": 402.2}, "type": "straight", "direction": "forward", "_calculated": {"startX": 1448, "startY": 503.2, "endX": 1448, "endY": 414.2, "cx": 1448, "cy": 458.7, "midX": 1448, "midY": 458.7, "ux": 0, "uy": -1, "nx": 1, "ny": 0}}, {"id": "arrow_1786344722586", "from": null, "to": null, "fromCoords": {"x": 1659, "y": 346.2}, "toCoords": {"x": 1659, "y": 415.2}, "type": "straight", "direction": "forward", "_calculated": {"startX": 1659, "startY": 348.2, "endX": 1659, "endY": 403.2, "cx": 1659, "cy": 375.7, "midX": 1659, "midY": 375.7, "ux": 0, "uy": 1, "nx": -1, "ny": 0}}, {"id": "arrow_1786344723937", "from": null, "to": null, "fromCoords": {"x": 1659, "y": 246.2}, "toCoords": {"x": 1659, "y": 323.2}, "type": "straight", "direction": "forward", "_calculated": {"startX": 1659, "startY": 248.2, "endX": 1659, "endY": 311.2, "cx": 1659, "cy": 279.7, "midX": 1659, "midY": 279.7, "ux": 0, "uy": 1, "nx": -1, "ny": 0}}, {"id": "arrow_1786344725257", "from": null, "to": null, "fromCoords": {"x": 1659, "y": 160.2}, "toCoords": {"x": 1658, "y": 226.2}, "type": "straight", "direction": "forward", "_calculated": {"startX": 1658.9697004474074, "startY": 162.19977047110729, "endX": 1658.1817973155553, "endY": 214.2013771733562, "cx": 1658.5757488814813, "cy": 188.20057382223175, "midX": 1658.5757488814813, "midY": 188.20057382223175, "ux": -0.015149776296267386, "uy": 0.9998852355536475, "nx": -0.9998852355536475, "ny": -0.015149776296267386}}, {"id": "arrow_1786344727676", "from": null, "to": null, "fromCoords": {"x": 1659, "y": 79.2}, "toCoords": {"x": 1659, "y": 139.2}, "type": "straight", "direction": "forward", "_calculated": {"startX": 1659, "startY": 81.2, "endX": 1659, "endY": 127.19999999999999, "cx": 1659, "cy": 104.19999999999999, "midX": 1659, "midY": 104.19999999999999, "ux": 0, "uy": 1, "nx": -1, "ny": 0}}, {"id": "arrow_1786344731405", "from": null, "to": null, "fromCoords": {"x": 1618, "y": 233.2}, "toCoords": {"x": 1525, "y": 233.2}, "type": "straight", "direction": "forward", "_calculated": {"startX": 1616, "startY": 233.2, "endX": 1537, "endY": 233.2, "cx": 1576.5, "cy": 233.2, "midX": 1576.5, "midY": 233.2, "ux": -1, "uy": 0, "nx": 0, "ny": -1}}, {"id": "arrow_1786344732885", "from": null, "to": null, "fromCoords": {"x": 1446, "y": 232.2}, "toCoords": {"x": 1346, "y": 232.2}, "type": "straight", "direction": "forward", "_calculated": {"startX": 1444, "startY": 232.2, "endX": 1358, "endY": 232.2, "cx": 1401, "cy": 232.2, "midX": 1401, "midY": 232.2, "ux": -1, "uy": 0, "nx": 0, "ny": -1}}, {"id": "arrow_1786344747446", "from": null, "to": null, "fromCoords": {"x": 1291, "y": 858.7}, "toCoords": {"x": 900, "y": 946.6}, "type": "orthogonal", "direction": "forward", "_calculated": {"startX": 1290, "startY": 855.2, "endX": 1290, "endY": 1017.2, "cx": 1290, "cy": 936.2, "midX": 1290, "midY": 936.2, "ux": 0, "uy": 1, "nx": -1, "ny": 0}, "waypoints": [{"x": 1291, "y": 1018.2}, {"x": 900, "y": 1018.2}]}, {"id": "arrow_1786344757550", "from": null, "to": null, "fromCoords": {"x": 1439.8, "y": 858.7}, "toCoords": {"x": 837.3, "y": 960.6}, "type": "orthogonal", "direction": "forward", "_calculated": {"startX": 1441, "startY": 858.2, "endX": 1441, "endY": 1048.2, "cx": 1441, "cy": 953.2, "midX": 1441, "midY": 953.2, "ux": 0, "uy": 1, "nx": -1, "ny": 0}, "waypoints": [{"x": 1439.8, "y": 1048.2}, {"x": 837.3, "y": 1048.2}]}], "customGenes": [{"id": "gene_1786343752662_379", "symbol": "SHM1", "x": 34.7045, "y": 54.5288, "rep_log2fc": -1.1817, "genes": [{"locus_tag": "YBR263W", "gene_symbol": "SHM1", "description": "", "biotype": "protein_coding", "wt_val": 265.28, "mutant_val": 116.94, "log2fc": -1.1817, "pvalue": 0.097309, "fdr": 0.182793, "wt_reps": [236.3, 260.12, 299.43], "mut_reps": [61.89, 224.29, 64.64], "original_index": 470}]}, {"id": "gene_1786343755755_416", "symbol": "SHM2", "x": 34.6538, "y": 56.3008, "rep_log2fc": -0.7561, "genes": [{"locus_tag": "YLR058C", "gene_symbol": "SHM2", "description": "", "biotype": "protein_coding", "wt_val": 208.05, "mutant_val": 123.18, "log2fc": -0.7561, "pvalue": 0.180212, "fdr": 0.257156, "wt_reps": [183.12, 203.79, 237.24], "mut_reps": [65.74, 208.11, 95.69], "original_index": 596}]}, {"id": "gene_1786344125523_138", "symbol": "KGD1", "x": 57.8617, "y": 60.8174, "rep_log2fc": -2.1031, "genes": [{"locus_tag": "YIL125W", "gene_symbol": "KGD1", "description": "", "biotype": "protein_coding", "wt_val": 152.54, "mutant_val": 35.5, "log2fc": -2.1031, "pvalue": 0.006809, "fdr": 0.113764, "wt_reps": [177.83, 120.72, 159.07], "mut_reps": [20.22, 65.68, 20.59], "original_index": 769}]}, {"id": "gene_1786344132702_970", "symbol": "KGD2", "x": 57.8617, "y": 62.3391, "rep_log2fc": -2.0677, "genes": [{"locus_tag": "YDR148C", "gene_symbol": "KGD2", "description": "", "biotype": "protein_coding", "wt_val": 131.27, "mutant_val": 31.3, "log2fc": -2.0677, "pvalue": 0.012528, "fdr": 0.11579, "wt_reps": [156.23, 97.21, 140.37], "mut_reps": [16.94, 57.24, 19.73], "original_index": 859}]}, {"id": "gene_1786344137858_292", "symbol": "IDH1", "x": 58.7128, "y": 69.5739, "rep_log2fc": -1.6264, "genes": [{"locus_tag": "YNL037C", "gene_symbol": "IDH1", "description": "", "biotype": "protein_coding", "wt_val": 46.22, "mutant_val": 14.97, "log2fc": -1.6264, "pvalue": 0.024122, "fdr": 0.122982, "wt_reps": [45.72, 46.13, 46.82], "mut_reps": [11.61, 24.78, 8.51], "original_index": 2052}]}, {"id": "gene_1786344141695_846", "symbol": "IDH2", "x": 58.7128, "y": 71.0957, "rep_log2fc": -2.001, "genes": [{"locus_tag": "YOR136W", "gene_symbol": "IDH2", "description": "", "biotype": "protein_coding", "wt_val": 93, "mutant_val": 23.23, "log2fc": -2.001, "pvalue": 0.004419, "fdr": 0.113764, "wt_reps": [75.73, 99.18, 104.09], "mut_reps": [16.59, 39.58, 13.51], "original_index": 1150}]}, {"id": "gene_1786344145955_216", "symbol": "ACO1", "x": 56.6489, "y": 79.3739, "rep_log2fc": -2.7572, "genes": [{"locus_tag": "YLR304C", "gene_symbol": "ACO1", "description": "", "biotype": "protein_coding", "wt_val": 300.7, "mutant_val": 44.47, "log2fc": -2.7572, "pvalue": 0.00921, "fdr": 0.115109, "wt_reps": [363.19, 234.09, 304.81], "mut_reps": [27.32, 81.72, 24.37], "original_index": 426}]}, {"id": "gene_1786344148837_703", "symbol": "ACO2", "x": 56.6489, "y": 80.8957, "rep_log2fc": -0.4991, "genes": [{"locus_tag": "YJL200C", "gene_symbol": "ACO2", "description": "", "biotype": "protein_coding", "wt_val": 59.93, "mutant_val": 42.4, "log2fc": -0.4991, "pvalue": 0.444344, "fdr": 0.495782, "wt_reps": [43, 68.95, 67.83], "mut_reps": [28.56, 77.92, 20.72], "original_index": 1654}]}, {"id": "gene_1786344154012_668", "symbol": "CIT1", "x": 50.6383, "y": 81.7478, "rep_log2fc": -2.892, "genes": [{"locus_tag": "YNR001C", "gene_symbol": "CIT1", "description": "", "biotype": "protein_coding", "wt_val": 187.74, "mutant_val": 25.28, "log2fc": -2.892, "pvalue": 0.015661, "fdr": 0.118231, "wt_reps": [233.75, 145.6, 183.87], "mut_reps": [15.58, 42.88, 17.39], "original_index": 645}]}, {"id": "gene_1786344158259_360", "symbol": "CIT2", "x": 50.6383, "y": 83.2696, "rep_log2fc": -3.7558, "genes": [{"locus_tag": "YCR005C", "gene_symbol": "CIT2", "description": "", "biotype": "protein_coding", "wt_val": 719.55, "mutant_val": 53.26, "log2fc": -3.7558, "pvalue": 0.151747, "fdr": 0.230936, "wt_reps": [1268.87, 262.42, 627.37], "mut_reps": [51.29, 48.85, 59.63], "original_index": 233}]}, {"id": "gene_1786344161196_639", "symbol": "CIT3", "x": 50.6383, "y": 84.7913, "rep_log2fc": -3.5932, "genes": [{"locus_tag": "YPR001W", "gene_symbol": "CIT3", "description": "", "biotype": "protein_coding", "wt_val": 16.94, "mutant_val": 1.39, "log2fc": -3.5932, "pvalue": 0.053627, "fdr": 0.146997, "wt_reps": [24.43, 12.89, 13.48], "mut_reps": [1.24, 1.47, 1.48], "original_index": 3983}]}, {"id": "gene_1786344167359_33", "symbol": "MDH1", "x": 43.8085, "y": 77.9478, "rep_log2fc": -1.994, "genes": [{"locus_tag": "YKL085W", "gene_symbol": "MDH1", "description": "", "biotype": "protein_coding", "wt_val": 108.69, "mutant_val": 27.28, "log2fc": -1.994, "pvalue": 0.006664, "fdr": 0.113764, "wt_reps": [124.88, 87.43, 113.75], "mut_reps": [17.25, 49.59, 14.99], "original_index": 1020}]}, {"id": "gene_1786344170062_774", "symbol": "MDH2", "x": 43.8085, "y": 79.4696, "rep_log2fc": -4.4784, "genes": [{"locus_tag": "YOL126C", "gene_symbol": "MDH2", "description": "", "biotype": "protein_coding", "wt_val": 671.15, "mutant_val": 30.1, "log2fc": -4.4784, "pvalue": 0.155649, "fdr": 0.234124, "wt_reps": [1190.22, 195.67, 627.56], "mut_reps": [17.87, 54.97, 17.46], "original_index": 243}]}, {"id": "gene_1786344172968_218", "symbol": "MDH3", "x": 43.8085, "y": 80.9913, "rep_log2fc": -1.5101, "genes": [{"locus_tag": "YDL078C", "gene_symbol": "MDH3", "description": "", "biotype": "protein_coding", "wt_val": 252.81, "mutant_val": 88.75, "log2fc": -1.5101, "pvalue": 0.033786, "fdr": 0.127021, "wt_reps": [317.23, 208.32, 232.86], "mut_reps": [94.89, 95.92, 75.45], "original_index": 483}]}, {"id": "gene_1786344180046_160", "symbol": "FUM1", "x": 42.0682, "y": 69.0945, "rep_log2fc": -1.661, "genes": [{"locus_tag": "YPL262W", "gene_symbol": "FUM1", "description": "", "biotype": "protein_coding", "wt_val": 157.66, "mutant_val": 49.85, "log2fc": -1.661, "pvalue": 0.028411, "fdr": 0.125817, "wt_reps": [152.87, 153.12, 166.98], "mut_reps": [27.65, 90.31, 31.58], "original_index": 750}]}, {"id": "gene_1786344184588_326", "symbol": "FRD1", "x": 45.2892, "y": 62.1495, "rep_log2fc": -1.3041, "genes": [{"locus_tag": "YEL047C", "gene_symbol": "FRD1", "description": "", "biotype": "protein_coding", "wt_val": 44.43, "mutant_val": 17.99, "log2fc": -1.3041, "pvalue": 0.055799, "fdr": 0.149584, "wt_reps": [40.03, 42.31, 50.94], "mut_reps": [9.76, 33.09, 11.1], "original_index": 2122}]}, {"id": "gene_1786344189678_26", "symbol": "SDH1", "x": 42.4734, "y": 59.4261, "rep_log2fc": -3.7032, "genes": [{"locus_tag": "YKL148C", "gene_symbol": "SDH1", "description": "", "biotype": "protein_coding", "wt_val": 104.05, "mutant_val": 7.98, "log2fc": -3.7032, "pvalue": 0.062466, "fdr": 0.154653, "wt_reps": [144.52, 56.29, 111.35], "mut_reps": [4.35, 14.8, 4.79], "original_index": 1052}]}, {"id": "gene_1786344193515_402", "symbol": "SDH2", "x": 42.4734, "y": 60.9478, "rep_log2fc": -2.3544, "genes": [{"locus_tag": "YLL041C", "gene_symbol": "SDH2", "description": "", "biotype": "protein_coding", "wt_val": 97.82, "mutant_val": 19.12, "log2fc": -2.3544, "pvalue": 0.01985, "fdr": 0.119487, "wt_reps": [125.06, 71.93, 96.46], "mut_reps": [11.13, 35.03, 11.19], "original_index": 1108}]}, {"id": "gene_1786344198246_469", "symbol": "ACH1", "x": 50.4563, "y": 56.1218, "rep_log2fc": -3.6755, "genes": [{"locus_tag": "YBL015W", "gene_symbol": "ACH1", "description": "", "biotype": "protein_coding", "wt_val": 108.61, "mutant_val": 8.49, "log2fc": -3.6755, "pvalue": 0.066946, "fdr": 0.156993, "wt_reps": [160.06, 65.32, 100.45], "mut_reps": [5.22, 14.41, 5.85], "original_index": 1018}]}, {"id": "gene_1786344202613_225", "symbol": "AAT1", "x": 40.6117, "y": 82.713, "rep_log2fc": -1.0553, "genes": [{"locus_tag": "YKL106W", "gene_symbol": "AAT1", "description": "", "biotype": "protein_coding", "wt_val": 48.94, "mutant_val": 23.55, "log2fc": -1.0553, "pvalue": 0.018658, "fdr": 0.119463, "wt_reps": [54.81, 44, 48.02], "mut_reps": [23.74, 32.17, 14.73], "original_index": 1953}]}, {"id": "gene_1786344207376_512", "symbol": "AAT2", "x": 40.6117, "y": 84.2348, "rep_log2fc": -1.3203, "genes": [{"locus_tag": "YLR027C", "gene_symbol": "AAT2", "description": "", "biotype": "protein_coding", "wt_val": 223.51, "mutant_val": 89.5, "log2fc": -1.3203, "pvalue": 0.054237, "fdr": 0.147837, "wt_reps": [171.01, 240.61, 258.92], "mut_reps": [46.24, 167.25, 55.01], "original_index": 544}]}, {"id": "gene_1786344267820_976", "symbol": "GDH1", "x": 56.9468, "y": 53.1304, "rep_log2fc": -1.3531, "genes": [{"locus_tag": "YOR375C", "gene_symbol": "GDH1", "description": "", "biotype": "protein_coding", "wt_val": 959.35, "mutant_val": 375.52, "log2fc": -1.3531, "pvalue": 0.048468, "fdr": 0.141748, "wt_reps": [804.6, 948.4, 1125.07], "mut_reps": [214.01, 700.33, 212.22], "original_index": 198}]}, {"id": "gene_1786344271027_48", "symbol": "GDH3", "x": 56.9468, "y": 54.6522, "rep_log2fc": -3.2601, "genes": [{"locus_tag": "YAL062W", "gene_symbol": "GDH3", "description": "", "biotype": "protein_coding", "wt_val": 18.3, "mutant_val": 1.9, "log2fc": -3.2601, "pvalue": 0.071384, "fdr": 0.159172, "wt_reps": [20.16, 9.41, 25.34], "mut_reps": [1.03, 2.75, 1.92], "original_index": 3856}]}, {"id": "gene_1786344831431_600", "symbol": "HXT1", "x": 90.5321, "y": 10.0087, "rep_log2fc": -1.0373, "genes": [{"locus_tag": "YHR094C", "gene_symbol": "HXT1", "description": "", "biotype": "protein_coding", "wt_val": 170.08, "mutant_val": 82.86, "log2fc": -1.0373, "pvalue": 0.125633, "fdr": 0.207213, "wt_reps": [128.01, 186.02, 196.21], "mut_reps": [52.16, 155.83, 40.6], "original_index": 701}]}, {"id": "gene_1786344839162_337", "symbol": "HXK1", "x": 90.3032, "y": 16.6261, "rep_log2fc": -3.6923, "genes": [{"locus_tag": "YFR053C", "gene_symbol": "HXK1", "description": "", "biotype": "protein_coding", "wt_val": 32.75, "mutant_val": 2.52, "log2fc": -3.6923, "pvalue": 0.022612, "fdr": 0.122189, "wt_reps": [39.9, 23.04, 35.31], "mut_reps": [0.96, 4.57, 2.04], "original_index": 2626}]}, {"id": "gene_1786344848628_511", "symbol": "HXK2", "x": 90.3032, "y": 18.1478, "rep_log2fc": -0.8597, "genes": [{"locus_tag": "YGL253W", "gene_symbol": "HXK2", "description": "", "biotype": "protein_coding", "wt_val": 631.76, "mutant_val": 348.14, "log2fc": -0.8597, "pvalue": 0.179636, "fdr": 0.256803, "wt_reps": [590.66, 623.97, 680.66], "mut_reps": [209.83, 631.47, 203.11], "original_index": 252}]}, {"id": "gene_1786344860414_476", "symbol": "ZWF1", "x": 86.3217, "y": 22.2657, "rep_log2fc": -1.4554, "genes": [{"locus_tag": "YNL241C", "gene_symbol": "ZWF1", "description": "", "biotype": "protein_coding", "wt_val": 97.81, "mutant_val": 35.66, "log2fc": -1.4554, "pvalue": 0.03016, "fdr": 0.125817, "wt_reps": [78.77, 99.74, 114.93], "mut_reps": [20.19, 64.83, 21.97], "original_index": 1117}]}, {"id": "gene_1786344865364_930", "symbol": "GND1", "x": 77.0957, "y": 20.6435, "rep_log2fc": -0.8137, "genes": [{"locus_tag": "YHR183W", "gene_symbol": "GND1", "description": "", "biotype": "protein_coding", "wt_val": 4648.12, "mutant_val": 2644.47, "log2fc": -0.8137, "pvalue": 0.187932, "fdr": 0.264559, "wt_reps": [4785.69, 4376.66, 4782.01], "mut_reps": [1580.8, 4694.21, 1658.4], "original_index": 26}]}, {"id": "gene_1786344867917_212", "symbol": "GND2", "x": 77.0957, "y": 22.1652, "rep_log2fc": -2.3069, "genes": [{"locus_tag": "YGR256W", "gene_symbol": "GND2", "description": "", "biotype": "protein_coding", "wt_val": 3.48, "mutant_val": 0.69, "log2fc": -2.3069, "pvalue": 0.058934, "fdr": 0.152286, "wt_reps": [2.05, 4.67, 3.71], "mut_reps": [0.42, 1.12, 0.54], "original_index": 5590}]}, {"id": "gene_1786344875007_908", "symbol": "PFK1", "x": 90.3138, "y": 33.1217, "rep_log2fc": -0.9018, "genes": [{"locus_tag": "YGR240C", "gene_symbol": "PFK1", "description": "", "biotype": "protein_coding", "wt_val": 412.11, "mutant_val": 220.57, "log2fc": -0.9018, "pvalue": 0.194838, "fdr": 0.270803, "wt_reps": [401.36, 398.59, 436.39], "mut_reps": [110.15, 420.84, 130.72], "original_index": 332}]}, {"id": "gene_1786344877653_592", "symbol": "PFK2", "x": 90.3138, "y": 34.6435, "rep_log2fc": -0.8931, "genes": [{"locus_tag": "YMR205C", "gene_symbol": "PFK2", "description": "", "biotype": "protein_coding", "wt_val": 357.82, "mutant_val": 192.67, "log2fc": -0.8931, "pvalue": 0.185514, "fdr": 0.262181, "wt_reps": [368.58, 319.11, 385.78], "mut_reps": [100.31, 361.96, 115.74], "original_index": 368}]}, {"id": "gene_1786344887432_637", "symbol": "PGI1", "x": 90.5552, "y": 25.4746, "rep_log2fc": -0.8138, "genes": [{"locus_tag": "YBR196C", "gene_symbol": "PGI1", "description": "", "biotype": "protein_coding", "wt_val": 937.74, "mutant_val": 533.46, "log2fc": -0.8138, "pvalue": 0.136055, "fdr": 0.217212, "wt_reps": [803.12, 967.55, 1042.55], "mut_reps": [363.39, 886.15, 350.86], "original_index": 203}]}, {"id": "gene_1786344897134_182", "symbol": "FBA1", "x": 90.4469, "y": 41.7725, "rep_log2fc": -0.7374, "genes": [{"locus_tag": "YKL060C", "gene_symbol": "FBA1", "description": "", "biotype": "protein_coding", "wt_val": 7897.81, "mutant_val": 4737.13, "log2fc": -0.7374, "pvalue": 0.185759, "fdr": 0.262412, "wt_reps": [7730.06, 7518.58, 8444.79], "mut_reps": [2846.31, 7943.27, 3421.8], "original_index": 9}]}, {"id": "gene_1786344902778_650", "symbol": "TPI1", "x": 91.0551, "y": 46.1045, "rep_log2fc": -0.3929, "genes": [{"locus_tag": "YDR050C", "gene_symbol": "TPI1", "description": "", "biotype": "protein_coding", "wt_val": 1603.74, "mutant_val": 1221.42, "log2fc": -0.3929, "pvalue": 0.45205, "fdr": 0.502739, "wt_reps": [2180.8, 1102.36, 1528.05], "mut_reps": [932.99, 1890.04, 841.22], "original_index": 148}]}, {"id": "gene_1786344909413_90", "symbol": "GPD1", "x": 83.0532, "y": 43.9826, "rep_log2fc": 0.0182, "genes": [{"locus_tag": "YDL022W", "gene_symbol": "GPD1", "description": "", "biotype": "protein_coding", "wt_val": 41.15, "mutant_val": 41.67, "log2fc": 0.0182, "pvalue": 0.97941, "fdr": 0.995862, "wt_reps": [36.21, 34.25, 52.98], "mut_reps": [25.77, 76.31, 22.93], "original_index": 2255}]}, {"id": "gene_1786344913892_728", "symbol": "GPD2", "x": 83.0532, "y": 45.5043, "rep_log2fc": -0.1692, "genes": [{"locus_tag": "YOL059W", "gene_symbol": "GPD2", "description": "", "biotype": "protein_coding", "wt_val": 24.3, "mutant_val": 21.61, "log2fc": -0.1692, "pvalue": 0.766316, "fdr": 0.798236, "wt_reps": [17.35, 25.68, 29.86], "mut_reps": [14.48, 36.38, 13.96], "original_index": 3218}]}, {"id": "gene_1786344922528_452", "symbol": "GUT2", "x": 82.3059, "y": 47.3746, "rep_log2fc": -3.7614, "genes": [{"locus_tag": "YIL155C", "gene_symbol": "GUT2", "description": "", "biotype": "protein_coding", "wt_val": 78.76, "mutant_val": 5.8, "log2fc": -3.7614, "pvalue": 0.017855, "fdr": 0.118978, "wt_reps": [85.5, 57.04, 93.75], "mut_reps": [3.02, 11.21, 3.17], "original_index": 1337}]}, {"id": "gene_1786344931266_720", "symbol": "GPP1", "x": 80.0479, "y": 40.2609, "rep_log2fc": 0.0405, "genes": [{"locus_tag": "YIL053W", "gene_symbol": "GPP1", "description": "", "biotype": "protein_coding", "wt_val": 680.49, "mutant_val": 699.86, "log2fc": 0.0405, "pvalue": 0.94307, "fdr": 0.962689, "wt_reps": [650.35, 647.8, 743.31], "mut_reps": [417.51, 1175.41, 506.67], "original_index": 240}]}, {"id": "gene_1786344934541_866", "symbol": "GPP2", "x": 80.0479, "y": 41.7826, "rep_log2fc": -1.573, "genes": [{"locus_tag": "YER062C", "gene_symbol": "GPP2", "description": "", "biotype": "protein_coding", "wt_val": 74.15, "mutant_val": 24.92, "log2fc": -1.573, "pvalue": 0.039198, "fdr": 0.131207, "wt_reps": [77.71, 69.03, 75.72], "mut_reps": [13.46, 46.68, 14.61], "original_index": 1390}]}, {"id": "gene_1786344940441_15", "symbol": "GUT1", "x": 76.9691, "y": 40.7671, "rep_log2fc": -2.4917, "genes": [{"locus_tag": "YHL032C", "gene_symbol": "GUT1", "description": "", "biotype": "protein_coding", "wt_val": 38.3, "mutant_val": 6.8, "log2fc": -2.4917, "pvalue": 0.007326, "fdr": 0.115075, "wt_reps": [38.71, 30.17, 46.01], "mut_reps": [3.64, 12.48, 4.28], "original_index": 2374}]}, {"id": "gene_1786344960358_839", "symbol": "TDH3", "x": 94.7922, "y": 49.8929, "rep_log2fc": -0.7684, "genes": [{"locus_tag": "YGR192C", "gene_symbol": "TDH3", "description": "", "biotype": "protein_coding", "wt_val": 11565.04, "mutant_val": 6789.66, "log2fc": -0.7684, "pvalue": 0.215571, "fdr": 0.28992, "wt_reps": [8699.62, 11178.02, 14817.46], "mut_reps": [3915.38, 12025.32, 4428.28], "original_index": 3}]}, {"id": "gene_1786344967165_72", "symbol": "PGK1", "x": 94.5053, "y": 59.4808, "rep_log2fc": -0.6741, "genes": [{"locus_tag": "YCR012W", "gene_symbol": "PGK1", "description": "", "biotype": "protein_coding", "wt_val": 2327.21, "mutant_val": 1458.55, "log2fc": -0.6741, "pvalue": 0.237624, "fdr": 0.309761, "wt_reps": [2878.75, 1765.08, 2337.78], "mut_reps": [937.94, 2485.08, 952.62], "original_index": 107}]}, {"id": "gene_1786344973084_332", "symbol": "GPM1", "x": 94.4274, "y": 68.8837, "rep_log2fc": -0.4074, "genes": [{"locus_tag": "YKL152C", "gene_symbol": "GPM1", "description": "", "biotype": "protein_coding", "wt_val": 4965.58, "mutant_val": 3743.93, "log2fc": -0.4074, "pvalue": 0.233745, "fdr": 0.306348, "wt_reps": [6236.8, 4110.39, 4549.55], "mut_reps": [3401.11, 4875.63, 2955.05], "original_index": 20}]}, {"id": "gene_1786344978199_351", "symbol": "ENO1", "x": 91.2021, "y": 73.7478, "rep_log2fc": 0.2479, "genes": [{"locus_tag": "YGR254W", "gene_symbol": "ENO1", "description": "", "biotype": "protein_coding", "wt_val": 393.88, "mutant_val": 467.72, "log2fc": 0.2479, "pvalue": 0.71956, "fdr": 0.755113, "wt_reps": [479.85, 294.82, 406.96], "mut_reps": [255.21, 813.86, 334.1], "original_index": 342}]}, {"id": "gene_1786344981183_379", "symbol": "ENO2", "x": 91.2021, "y": 75.2696, "rep_log2fc": -0.9064, "genes": [{"locus_tag": "YHR174W", "gene_symbol": "ENO2", "description": "", "biotype": "protein_coding", "wt_val": 7134.59, "mutant_val": 3806.32, "log2fc": -0.9064, "pvalue": 0.158497, "fdr": 0.23654, "wt_reps": [7802, 5716.4, 7885.37], "mut_reps": [1981.12, 6961.03, 2476.8], "original_index": 12}]}, {"id": "gene_1786344989581_792", "symbol": "PYK1", "x": 83.1543, "y": 73.9478, "rep_log2fc": 0, "genes": []}, {"id": "gene_1786344993654_218", "symbol": "PYK2", "x": 83.1543, "y": 75.4696, "rep_log2fc": -1.9704, "genes": [{"locus_tag": "YOR347C", "gene_symbol": "PYK2", "description": "", "biotype": "protein_coding", "wt_val": 13.35, "mutant_val": 3.4, "log2fc": -1.9704, "pvalue": 0.065202, "fdr": 0.155522, "wt_reps": [11.36, 9.46, 19.23], "mut_reps": [2, 5.64, 2.56], "original_index": 4501}]}, {"id": "gene_1786345000828_688", "symbol": "PDA1", "x": 75.1489, "y": 74.0087, "rep_log2fc": -1.3173, "genes": [{"locus_tag": "YER178W", "gene_symbol": "PDA1", "description": "", "biotype": "protein_coding", "wt_val": 439.71, "mutant_val": 176.44, "log2fc": -1.3173, "pvalue": 0.04742, "fdr": 0.140678, "wt_reps": [376.08, 409.68, 533.37], "mut_reps": [92.19, 321.67, 115.47], "original_index": 317}]}, {"id": "gene_1786345003855_825", "symbol": "PDB1", "x": 75.1489, "y": 75.5304, "rep_log2fc": -1.334, "genes": [{"locus_tag": "YBR221C", "gene_symbol": "PDB1", "description": "", "biotype": "protein_coding", "wt_val": 262.58, "mutant_val": 104.15, "log2fc": -1.334, "pvalue": 0.050392, "fdr": 0.143784, "wt_reps": [198.92, 272.18, 316.63], "mut_reps": [60.87, 192.32, 59.26], "original_index": 473}]}, {"id": "gene_1786345014938_186", "symbol": "PDC1", "x": 78.8138, "y": 68.3304, "rep_log2fc": -1.1355, "genes": [{"locus_tag": "YLR044C", "gene_symbol": "PDC1", "description": "", "biotype": "protein_coding", "wt_val": 7944.95, "mutant_val": 3616.26, "log2fc": -1.1355, "pvalue": 0.078473, "fdr": 0.165455, "wt_reps": [6882.6, 7533.12, 9419.13], "mut_reps": [1879.76, 6524.48, 2444.53], "original_index": 8}]}, {"id": "gene_1786345018283_743", "symbol": "PDC5", "x": 78.8138, "y": 69.8522, "rep_log2fc": -1.0737, "genes": [{"locus_tag": "YLR134W", "gene_symbol": "PDC5", "description": "", "biotype": "protein_coding", "wt_val": 10.19, "mutant_val": 4.84, "log2fc": -1.0737, "pvalue": 0.146578, "fdr": 0.226044, "wt_reps": [12.36, 7.2, 11.01], "mut_reps": [1.92, 9.61, 2.98], "original_index": 4909}]}, {"id": "gene_1786345022517_466", "symbol": "PDC6", "x": 78.8138, "y": 71.3739, "rep_log2fc": -1.9642, "genes": [{"locus_tag": "YGR087C", "gene_symbol": "PDC6", "description": "", "biotype": "protein_coding", "wt_val": 0.76, "mutant_val": 0.19, "log2fc": -1.9642, "pvalue": 0.055136, "fdr": 0.149047, "wt_reps": [0.63, 1.09, 0.57], "mut_reps": [0.08, 0.33, 0.16], "original_index": 5987}]}, {"id": "gene_1786345030966_651", "symbol": "ADH1", "x": 77.4521, "y": 58.3826, "rep_log2fc": -0.249, "genes": [{"locus_tag": "YOL086C", "gene_symbol": "ADH1", "description": "", "biotype": "protein_coding", "wt_val": 4020.25, "mutant_val": 3382.97, "log2fc": -0.249, "pvalue": 0.615125, "fdr": 0.656997, "wt_reps": [4673.87, 3234.27, 4152.62], "mut_reps": [2402.28, 5464.56, 2282.06], "original_index": 36}]}, {"id": "gene_1786345033473_824", "symbol": "ADH2", "x": 77.4521, "y": 59.9043, "rep_log2fc": -1.6443, "genes": [{"locus_tag": "YMR303C", "gene_symbol": "ADH2", "description": "", "biotype": "protein_coding", "wt_val": 1039.41, "mutant_val": 332.5, "log2fc": -1.6443, "pvalue": 0.021542, "fdr": 0.121665, "wt_reps": [1246.97, 752.1, 1119.18], "mut_reps": [208.62, 541.84, 247.03], "original_index": 193}]}, {"id": "gene_1786345035988_570", "symbol": "ADH3", "x": 77.4521, "y": 61.4261, "rep_log2fc": -1.5156, "genes": [{"locus_tag": "YMR083W", "gene_symbol": "ADH3", "description": "", "biotype": "protein_coding", "wt_val": 368.15, "mutant_val": 128.76, "log2fc": -1.5156, "pvalue": 0.040381, "fdr": 0.1329, "wt_reps": [361.63, 354.43, 388.37], "mut_reps": [72.45, 233.56, 80.26], "original_index": 361}]}, {"id": "gene_1786345039245_15", "symbol": "ADH4", "x": 80.7447, "y": 58.2609, "rep_log2fc": -1.1212, "genes": [{"locus_tag": "YGL256W", "gene_symbol": "ADH4", "description": "", "biotype": "protein_coding", "wt_val": 29.69, "mutant_val": 13.64, "log2fc": -1.1212, "pvalue": 0.074284, "fdr": 0.161836, "wt_reps": [28.3, 28.14, 32.63], "mut_reps": [9.71, 23.55, 7.67], "original_index": 2811}]}, {"id": "gene_1786345041536_486", "symbol": "ADH5", "x": 80.7447, "y": 59.7826, "rep_log2fc": -0.3989, "genes": [{"locus_tag": "YBR145W", "gene_symbol": "ADH5", "description": "", "biotype": "protein_coding", "wt_val": 11.46, "mutant_val": 8.69, "log2fc": -0.3989, "pvalue": 0.162506, "fdr": 0.240528, "wt_reps": [10.84, 11.36, 12.16], "mut_reps": [8.66, 10.98, 6.41], "original_index": 4750}]}, {"id": "gene_1786345044066_706", "symbol": "ADH6", "x": 80.7447, "y": 61.3043, "rep_log2fc": -1.2499, "genes": [{"locus_tag": "YMR318C", "gene_symbol": "ADH6", "description": "", "biotype": "protein_coding", "wt_val": 493.86, "mutant_val": 207.66, "log2fc": -1.2499, "pvalue": 0.058096, "fdr": 0.151464, "wt_reps": [503.69, 474.41, 503.48], "mut_reps": [144.16, 354.65, 124.16], "original_index": 293}]}, {"id": "gene_1786345046568_966", "symbol": "ADH7", "x": 83.9362, "y": 58.6737, "rep_log2fc": -0.75, "genes": [{"locus_tag": "YCR105W", "gene_symbol": "ADH7", "description": "", "biotype": "protein_coding", "wt_val": 1.48, "mutant_val": 0.88, "log2fc": -0.75, "pvalue": 0.350146, "fdr": 0.415366, "wt_reps": [1.88, 0.51, 2.06], "mut_reps": [1.05, 0.4, 1.18], "original_index": 5836}]}, {"id": "gene_1786345056236_964", "symbol": "ALD2", "x": 74.7766, "y": 61.687, "rep_log2fc": -2.41, "genes": [{"locus_tag": "YMR170C", "gene_symbol": "ALD2", "description": "", "biotype": "protein_coding", "wt_val": 27.45, "mutant_val": 5.16, "log2fc": -2.41, "pvalue": 0.046894, "fdr": 0.13991, "wt_reps": [29.16, 17.13, 36.05], "mut_reps": [3.15, 8.38, 3.94], "original_index": 2951}]}, {"id": "gene_1786345061796_396", "symbol": "ALD3", "x": 74.7766, "y": 63.2087, "rep_log2fc": -2.7305, "genes": [{"locus_tag": "YMR169C", "gene_symbol": "ALD3", "description": "", "biotype": "protein_coding", "wt_val": 11.91, "mutant_val": 1.79, "log2fc": -2.7305, "pvalue": 0.002532, "fdr": 0.113764, "wt_reps": [13.1, 10.5, 12.14], "mut_reps": [1.69, 2.3, 1.38], "original_index": 4679}]}, {"id": "gene_1786345067836_892", "symbol": "ALD4", "x": 74.7766, "y": 64.7304, "rep_log2fc": -4.1021, "genes": [{"locus_tag": "YOR374W", "gene_symbol": "ALD4", "description": "", "biotype": "protein_coding", "wt_val": 1053.28, "mutant_val": 61.32, "log2fc": -4.1021, "pvalue": 0.031707, "fdr": 0.125817, "wt_reps": [1323.58, 693.62, 1142.63], "mut_reps": [38.7, 114.12, 31.15], "original_index": 191}]}, {"id": "gene_1786345072565_1000", "symbol": "ALD5", "x": 74.7766, "y": 66.2522, "rep_log2fc": -0.3427, "genes": [{"locus_tag": "YER073W", "gene_symbol": "ALD5", "description": "", "biotype": "protein_coding", "wt_val": 186.21, "mutant_val": 146.84, "log2fc": -0.3427, "pvalue": 0.569991, "fdr": 0.613465, "wt_reps": [167.96, 190.41, 200.26], "mut_reps": [91.97, 263.15, 85.39], "original_index": 648}]}, {"id": "gene_1786345075126_57", "symbol": "ALD6", "x": 74.7766, "y": 67.7739, "rep_log2fc": 0, "genes": [{"locus_tag": "YPL061W", "gene_symbol": "ALD6", "description": "", "biotype": "protein_coding", "wt_val": 0, "mutant_val": 0, "log2fc": 0, "pvalue": 1, "fdr": 1, "wt_reps": [0, 0, 0], "mut_reps": [0, 0, 0], "original_index": 6427}]}, {"id": "gene_1786345079083_126", "symbol": "ACS1", "x": 70.6543, "y": 68.087, "rep_log2fc": -6.2815, "genes": [{"locus_tag": "YAL054C", "gene_symbol": "ACS1", "description": "", "biotype": "protein_coding", "wt_val": 316.82, "mutant_val": 4.06, "log2fc": -6.2815, "pvalue": 0.046562, "fdr": 0.139699, "wt_reps": [404.84, 178.62, 367.01], "mut_reps": [3.44, 4.53, 4.22], "original_index": 407}]}, {"id": "gene_1786345087123_914", "symbol": "ACS2", "x": 70.6543, "y": 69.6087, "rep_log2fc": -1.5439, "genes": [{"locus_tag": "YLR153C", "gene_symbol": "ACS2", "description": "", "biotype": "protein_coding", "wt_val": 612.91, "mutant_val": 210.19, "log2fc": -1.5439, "pvalue": 0.016368, "fdr": 0.118231, "wt_reps": [683.27, 525.65, 629.81], "mut_reps": [144.06, 361.81, 124.7], "original_index": 255}]}]};

const AUTO_PATHWAY_PRESETS = {
    gsh: {
        id: "gsh",
        name: "글루타치온 (Glutathione, GSH) 생합성 및 산화환원 대사공학 종합 지도",
        tag: "항산화제 / 바이오제약 / 세포공장",
        desc: "TCA 사이클의 α-Ketoglutarate에서 유래한 L-Glutamate와 황 대사/세린 유래 Cysteine, Glycine이 GSH1, GSH2를 거쳐 최종 GSH로 합성되는 경로 및 GLR1(글루타치온 환원효소) 산화환원 사이클 완벽 통합",
        reactionsSummary: "α-Ketoglutarate -> Glutamate (GDH1, GLT1) + Cysteine -> γ-Glutamylcysteine (GSH1) + Glycine -> GSH (GSH2) <-> GSSG (GLR1)",
        targetZone: {
            id: "zone_target_gsh",
            label: "Glutathione (GSH) Biosynthesis & Redox Cycle",
            x: 556,
            y: 50,
            w: 604,
            h: 520,
            color: "emerald",
            titlePos: "top-left"
        },
        targetNodes: [
            { id: "node_gsh_glu", label: "Glutamate", x: 837.8, y: 500, w: 88, h: 28, shape: "round_box", type: "standard", fillColor: "#f8fafc", strokeColor: "#059669" },
            { id: "node_gsh_cys", label: "Cysteine", x: 600, y: 380, w: 88, h: 28, shape: "round_box", type: "standard", fillColor: "#ffffff", strokeColor: "#94a3b8" },
            { id: "node_gsh_ggc", label: "γ-Glutamylcysteine", x: 740, y: 380, w: 130, h: 28, shape: "round_box", type: "standard", fillColor: "#f8fafc", strokeColor: "#059669" },
            { id: "node_gsh_gly", label: "Glycine", x: 600, y: 480, w: 80, h: 28, shape: "round_box", type: "standard", fillColor: "#ffffff", strokeColor: "#94a3b8" },
            { id: "node_gsh_core", label: "GSH", x: 920, y: 380, w: 84, h: 30, shape: "round_box", type: "standard", fillColor: "#d1fae5", strokeColor: "#059669", borderWidth: 2 },
            { id: "node_gsh_gssg", label: "GSSG", x: 1070, y: 380, w: 84, h: 28, shape: "round_box", type: "standard", fillColor: "#ffffff", strokeColor: "#94a3b8" },
            { id: "node_gsh_nadph", label: "NADPH", x: 1070, y: 480, w: 84, h: 26, shape: "round_box", type: "standard", fillColor: "#eff6ff", strokeColor: "#3b82f6" }
        ],
        targetArrows: [
            { id: "arrow_gsh_1", from: "node_gsh_glu", to: "node_gsh_ggc", type: "straight", color: "#059669", width: 2 },
            { id: "arrow_gsh_2", from: "node_gsh_cys", to: "node_gsh_ggc", type: "straight", color: "#059669", width: 2 },
            { id: "arrow_gsh_3", from: "node_gsh_ggc", to: "node_gsh_core", type: "straight", color: "#059669", width: 2.5 },
            { id: "arrow_gsh_4", from: "node_gsh_gly", to: "node_gsh_core", type: "straight", color: "#059669", width: 2 },
            { id: "arrow_gsh_5", from: "node_gsh_core", to: "node_gsh_gssg", type: "curved", color: "#64748b", width: 1.5 },
            { id: "arrow_gsh_6", from: "node_gsh_gssg", to: "node_gsh_core", type: "curved", color: "#059669", width: 2 },
            { id: "arrow_gsh_7", from: "node_gsh_nadph", to: "node_gsh_core", type: "straight", color: "#3b82f6", width: 1.5 }
        ],
        dockingArrows: [
            { id: "dock_akg_to_glu", from: "node_1786343951233", to: "node_gsh_glu", type: "straight", color: "#6366f1", width: 2.5 }
        ],
        customGenes: [
            { id: "gene_dock_gdh", symbol: "GDH1", x: 54.0, y: 62.0, arrowId: "dock_akg_to_glu" },
            { id: "gene_dock_glt", symbol: "GLT1", x: 54.0, y: 64.0, arrowId: "dock_akg_to_glu" },
            { id: "gene_gsh1", symbol: "GSH1", x: 42.0, y: 43.0, arrowId: "arrow_gsh_1" },
            { id: "gene_gsh2", symbol: "GSH2", x: 44.5, y: 37.0, arrowId: "arrow_gsh_3" },
            { id: "gene_glr1", symbol: "GLR1", x: 53.0, y: 36.5, arrowId: "arrow_gsh_6" }
        ],
        text: `Glutamate + Cysteine -> γ-Glutamylcysteine (GSH1)
γ-Glutamylcysteine + Glycine -> GSH (GSH2)
GSH -> GSSG (GPX1)
GSSG -> GSH (GLR1)`
    },
    nam: {
        id: "nam",
        name: "니코틴아미드 (Nicotinamide, NAM / NAD+) 생합성 및 구제 대사공학 종합 지도",
        tag: "비타민 B3 / 바이오헬스 / 필수 조효소",
        desc: "TCA 사이클의 Oxaloacetate 및 Aspartate에서 출발하여 Quinolinic acid(QA) 및 NaMN, NaAD, NAD+를 거쳐 합성되는 NAM De novo 생합성 및 Nicotinic acid(NA) 구제(Salvage) 경로 완벽 통합",
        reactionsSummary: "Oxaloacetate -> Aspartate (AAT2) -> Quinolinic acid (nadA/B, BNA6) -> NaMN (QPT1) -> NaAD (NMA1/2) -> NAD+ (QNS1) -> Nicotinamide (NAM) (PNC1)",
        targetZone: {
            id: "zone_target_nam",
            label: "Nicotinamide (NAM) & NAD+ Biosynthesis Pathway",
            x: 556,
            y: 50,
            w: 604,
            h: 520,
            color: "blue",
            titlePos: "top-left"
        },
        targetNodes: [
            { id: "node_nam_asp", label: "Aspartate", x: 610, y: 490, w: 88, h: 28, shape: "round_box", type: "standard", fillColor: "#f8fafc", strokeColor: "#2563eb" },
            { id: "node_nam_qa", label: "Quinolinic acid", x: 610, y: 360, w: 110, h: 28, shape: "round_box", type: "standard", fillColor: "#ffffff", strokeColor: "#94a3b8" },
            { id: "node_nam_namn", label: "NaMN", x: 750, y: 360, w: 84, h: 28, shape: "round_box", type: "standard", fillColor: "#ffffff", strokeColor: "#94a3b8" },
            { id: "node_nam_naad", label: "NaAD", x: 880, y: 360, w: 84, h: 28, shape: "round_box", type: "standard", fillColor: "#ffffff", strokeColor: "#94a3b8" },
            { id: "node_nam_nad", label: "NAD+", x: 1020, y: 360, w: 84, h: 30, shape: "round_box", type: "standard", fillColor: "#eff6ff", strokeColor: "#2563eb" },
            { id: "node_nam_core", label: "Nicotinamide (NAM)", x: 1020, y: 220, w: 130, h: 30, shape: "round_box", type: "standard", fillColor: "#dbeafe", strokeColor: "#1d4ed8", borderWidth: 2 },
            { id: "node_nam_na", label: "Nicotinic acid", x: 780, y: 220, w: 100, h: 28, shape: "round_box", type: "standard", fillColor: "#ffffff", strokeColor: "#94a3b8" }
        ],
        targetArrows: [
            { id: "arrow_nam_1", from: "node_nam_asp", to: "node_nam_qa", type: "straight", color: "#2563eb", width: 2 },
            { id: "arrow_nam_2", from: "node_nam_qa", to: "node_nam_namn", type: "straight", color: "#2563eb", width: 2 },
            { id: "arrow_nam_3", from: "node_nam_namn", to: "node_nam_naad", type: "straight", color: "#2563eb", width: 2 },
            { id: "arrow_nam_4", from: "node_nam_naad", to: "node_nam_nad", type: "straight", color: "#2563eb", width: 2 },
            { id: "arrow_nam_5", from: "node_nam_nad", to: "node_nam_core", type: "straight", color: "#1d4ed8", width: 2.5 },
            { id: "arrow_nam_6", from: "node_nam_core", to: "node_nam_na", type: "straight", color: "#64748b", width: 1.5 },
            { id: "arrow_nam_7", from: "node_nam_na", to: "node_nam_namn", type: "straight", color: "#2563eb", width: 1.5 }
        ],
        dockingArrows: [
            { id: "dock_oaa_to_asp", from: "node_1786343963016", to: "node_nam_asp", type: "straight", color: "#6366f1", width: 2.5 }
        ],
        customGenes: [
            { id: "gene_dock_aat2", symbol: "AAT2", x: 39.0, y: 70.0, arrowId: "dock_oaa_to_asp" },
            { id: "gene_bna6", symbol: "BNA6", x: 32.5, y: 41.0, arrowId: "arrow_nam_1" },
            { id: "gene_qpt1", symbol: "QPT1", x: 36.5, y: 34.0, arrowId: "arrow_nam_2" },
            { id: "gene_nma1", symbol: "NMA1", x: 43.5, y: 34.0, arrowId: "arrow_nam_3" },
            { id: "gene_qns1", symbol: "QNS1", x: 50.5, y: 34.0, arrowId: "arrow_nam_4" },
            { id: "gene_pnc1_1", symbol: "PNC1", x: 54.5, y: 28.0, arrowId: "arrow_nam_5" },
            { id: "gene_npt1", symbol: "NPT1", x: 41.5, y: 28.0, arrowId: "arrow_nam_7" }
        ],
        text: `Aspartate -> Quinolinic acid (BNA6)
Quinolinic acid -> NaMN (QPT1)
NaMN -> NaAD (NMA1, NMA2)
NaAD -> NAD+ (QNS1)
NAD+ -> Nicotinamide (NAM) (PNC1)
Nicotinamide (NAM) -> Nicotinic acid (PNC1)
Nicotinic acid -> NaMN (NPT1)`
    },

    bdo: {
        id: "bdo",
        name: "2,3-부탄디올 (2,3-Butanediol) 생산 대사공학 종합 경로",
        tag: "산업 바이오화학 / 바이오연료",
        desc: "해당과정 피루브산(Pyruvate)에서 ILV2(아세토락테이트 합성), AlsD, BDH1 효소를 통해 합성되는 2,3-BDO 생산 경로 + 전체 당 대사/발효/TCA 사이클 완벽 통합",
        reactionsSummary: "Pyruvate -> 2-Acetolactate (ILV2) -> Acetoin (ILV5, AlsD) -> 2,3-Butanediol (BDH1, BDH2)",
        targetZone: {
            id: "zone_target_bdo",
            label: "2,3-Butanediol & Acetoin Biosynthetic Engineering Pathway",
            x: 600,
            y: 40,
            w: 580,
            h: 520,
            color: "emerald",
            titlePos: "top-left"
        },
        targetNodes: [
            { id: "node_bdo_acetolactate", label: "2-Acetolactate", x: 950, y: 390, w: 125, h: 32, shape: "round_box", type: "standard", fillColor: "#f8fafc", strokeColor: "#059669" },
            { id: "node_bdo_diacetyl", label: "Diacetyl", x: 740, y: 390, w: 90, h: 32, shape: "round_box", type: "standard", fillColor: "#f8fafc", strokeColor: "#059669" },
            { id: "node_bdo_acetoin", label: "Acetoin", x: 950, y: 230, w: 100, h: 32, shape: "round_box", type: "standard", fillColor: "#f8fafc", strokeColor: "#059669" },
            { id: "node_bdo_target", label: "2,3-Butanediol", x: 950, y: 80, w: 140, h: 36, shape: "round_box", type: "accent", fillColor: "#ecfdf5", strokeColor: "#059669", textColor: "#065f46" }
        ],
        targetArrows: [
            { id: "arr_pyr_to_acetolactate", from: "node_1786344482445", to: "node_bdo_acetolactate", type: "curved", curvature: 25, direction: "forward", geneSymbols: ["ILV2"] },
            { id: "arr_acetolactate_to_acetoin", from: "node_bdo_acetolactate", to: "node_bdo_acetoin", type: "straight", direction: "forward", geneSymbols: ["ILV5", "AlsD"] },
            { id: "arr_acetoin_to_bdo", from: "node_bdo_acetoin", to: "node_bdo_target", type: "straight", direction: "forward", geneSymbols: ["BDH1", "BDH2"] },
            { id: "arr_acetolactate_to_diacetyl", from: "node_bdo_acetolactate", to: "node_bdo_diacetyl", type: "straight", direction: "forward", label: "spontaneous", geneSymbols: [] },
            { id: "arr_diacetyl_to_acetoin", from: "node_bdo_diacetyl", to: "node_bdo_acetoin", type: "straight", direction: "forward", geneSymbols: ["BDH1"] }
        ],
        targetGenes: [
            { symbol: "ILV2", x: 62.5, y: 55.0, arrowId: "arr_pyr_to_acetolactate" },
            { symbol: "ILV5", x: 50.5, y: 29.5, arrowId: "arr_acetolactate_to_acetoin" },
            { symbol: "BDH1", x: 50.5, y: 14.8, arrowId: "arr_acetoin_to_bdo" },
            { symbol: "BDH2", x: 52.8, y: 14.8, arrowId: "arr_acetoin_to_bdo" }
        ],
        text: `Pyruvate -> 2-Acetolactate (ILV2)
2-Acetolactate -> Acetoin (ILV5, AlsD)
Acetoin -> 2,3-Butanediol (BDH1, BDH2)
2-Acetolactate -> Diacetyl
Diacetyl -> Acetoin (BDH1)`
    },
    naringenin: {
        id: "naringenin",
        name: "나린게닌 (Naringenin) 생합성 대사공학 종합 경로",
        tag: "플라보노이드 / 항산화",
        desc: "해당과정(PEP) + 오탄당 인산(E4P)의 시키메이트 경로 및 아세틸-CoA 유래 말로닐-CoA 풀에서 외래 효소(TAL, 4CL, CHS, CHI)로 합성되는 종합 대사 지도",
        reactionsSummary: "PEP + E4P -> Shikimate -> Tyrosine -> p-Coumarate -> 4-Coumaroyl-CoA (+ Malonyl-CoA) -> Naringenin",
        targetZone: {
            id: "zone_target_naringenin",
            label: "Aromatic Amino Acid & Naringenin Biosynthesis Pathway",
            x: 40,
            y: 40,
            w: 1140,
            h: 520,
            color: "violet",
            titlePos: "top-left"
        },
        targetNodes: [
            { id: "node_nar_shikimate", label: "Shikimate", x: 380, y: 420, w: 100, h: 32, shape: "round_box", type: "standard", fillColor: "#f8fafc", strokeColor: "#9333ea" },
            { id: "node_nar_chorismate", label: "Chorismate", x: 380, y: 300, w: 105, h: 32, shape: "round_box", type: "standard", fillColor: "#f8fafc", strokeColor: "#9333ea" },
            { id: "node_nar_tyrosine", label: "Tyrosine", x: 380, y: 180, w: 95, h: 32, shape: "round_box", type: "standard", fillColor: "#f8fafc", strokeColor: "#9333ea" },
            { id: "node_nar_malonyl", label: "Malonyl-CoA", x: 880, y: 380, w: 110, h: 32, shape: "round_box", type: "standard", fillColor: "#f8fafc", strokeColor: "#9333ea" },
            { id: "node_nar_coumarate", label: "p-Coumarate", x: 620, y: 180, w: 110, h: 32, shape: "round_box", type: "standard", fillColor: "#f8fafc", strokeColor: "#9333ea" },
            { id: "node_nar_coumaroyl", label: "4-Coumaroyl-CoA", x: 860, y: 180, w: 130, h: 32, shape: "round_box", type: "standard", fillColor: "#f8fafc", strokeColor: "#9333ea" },
            { id: "node_nar_chalcone", label: "Naringenin-chalcone", x: 860, y: 80, w: 150, h: 34, shape: "round_box", type: "standard", fillColor: "#f8fafc", strokeColor: "#9333ea" },
            { id: "node_nar_target", label: "Naringenin", x: 620, y: 80, w: 120, h: 36, shape: "round_box", type: "accent", fillColor: "#faf5ff", strokeColor: "#9333ea", textColor: "#6b21a8" }
        ],
        targetArrows: [
            { id: "arr_pep_to_shikimate", from: "node_1786344499435", to: "node_nar_shikimate", type: "curved", curvature: 35, direction: "forward", geneSymbols: ["ARO1"] },
            { id: "arr_shikimate_to_chorismate", from: "node_nar_shikimate", to: "node_nar_chorismate", type: "straight", direction: "forward", geneSymbols: ["ARO2"] },
            { id: "arr_chorismate_to_tyrosine", from: "node_nar_chorismate", to: "node_nar_tyrosine", type: "straight", direction: "forward", geneSymbols: ["TYR1", "AAT2"] },
            { id: "arr_accoa_to_malonyl", from: "node_1786344476268", to: "node_nar_malonyl", type: "curved", curvature: 25, direction: "forward", geneSymbols: ["ACC1"] },
            { id: "arr_tyr_to_coumarate", from: "node_nar_tyrosine", to: "node_nar_coumarate", type: "straight", direction: "forward", geneSymbols: ["TAL"] },
            { id: "arr_coumarate_to_coumaroyl", from: "node_nar_coumarate", to: "node_nar_coumaroyl", type: "straight", direction: "forward", geneSymbols: ["4CL"] },
            { id: "arr_coumaroyl_to_chalcone", from: "node_nar_coumaroyl", to: "node_nar_chalcone", type: "straight", direction: "forward", geneSymbols: ["CHS"] },
            { id: "arr_malonyl_to_chalcone", from: "node_nar_malonyl", to: "node_nar_chalcone", type: "curved", curvature: -25, direction: "forward", geneSymbols: [] },
            { id: "arr_chalcone_to_naringenin", from: "node_nar_chalcone", to: "node_nar_target", type: "straight", direction: "forward", geneSymbols: ["CHI"] }
        ],
        targetGenes: [
            { symbol: "ARO1", x: 55.0, y: 55.0, arrowId: "arr_pep_to_shikimate" },
            { symbol: "ARO2", x: 20.2, y: 34.0, arrowId: "arr_shikimate_to_chorismate" },
            { symbol: "TYR1", x: 20.2, y: 23.0, arrowId: "arr_chorismate_to_tyrosine" },
            { symbol: "AAT2", x: 22.5, y: 23.0, arrowId: "arr_chorismate_to_tyrosine" },
            { symbol: "ACC1", x: 56.0, y: 56.0, arrowId: "arr_accoa_to_malonyl" },
            { symbol: "TAL", x: 26.5, y: 17.0, arrowId: "arr_tyr_to_coumarate" },
            { symbol: "4CL", x: 39.0, y: 17.0, arrowId: "arr_coumarate_to_coumaroyl" },
            { symbol: "CHS", x: 45.7, y: 12.0, arrowId: "arr_coumaroyl_to_chalcone" },
            { symbol: "CHI", x: 39.0, y: 7.5, arrowId: "arr_chalcone_to_naringenin" }
        ],
        text: `PEP -> Shikimate (ARO1)
Shikimate -> Chorismate (ARO2)
Chorismate -> Tyrosine (TYR1, AAT2)
Acetyl-CoA -> Malonyl-CoA (ACC1)
Tyrosine -> p-Coumarate (TAL)
p-Coumarate -> 4-Coumaroyl-CoA (4CL)
4-Coumaroyl-CoA + Malonyl-CoA -> Naringenin-chalcone (CHS)
Naringenin-chalcone -> Naringenin (CHI)`
    },
    lycopene: {
        id: "lycopene",
        name: "라이코펜 (Lycopene) 테르페노이드 생산 대사공학 종합 경로",
        tag: "카로티노이드 / 천연색소",
        desc: "아세틸-CoA에서 메발로네이트(MVA) 경로를 거쳐 IPP/DMAPP, FPP, GGPP, 피토엔, 라이코펜을 생산하는 테르페노이드/카로티노이드 종합 지도",
        reactionsSummary: "Acetyl-CoA -> HMG-CoA -> Mevalonate -> IPP/DMAPP -> FPP -> GGPP -> Phytoene -> Lycopene",
        targetZone: {
            id: "zone_target_lycopene",
            label: "Mevalonate Pathway & Lycopene Biosynthesis",
            x: 80,
            y: 40,
            w: 1100,
            h: 520,
            color: "rose",
            titlePos: "top-left"
        },
        targetNodes: [
            { id: "node_lyc_acac", label: "Acetoacetyl-CoA", x: 950, y: 420, w: 125, h: 32, shape: "round_box", type: "standard", fillColor: "#f8fafc", strokeColor: "#e11d48" },
            { id: "node_lyc_hmg", label: "HMG-CoA", x: 750, y: 420, w: 100, h: 32, shape: "round_box", type: "standard", fillColor: "#f8fafc", strokeColor: "#e11d48" },
            { id: "node_lyc_mev", label: "Mevalonate", x: 550, y: 420, w: 100, h: 32, shape: "round_box", type: "standard", fillColor: "#f8fafc", strokeColor: "#e11d48" },
            { id: "node_lyc_ipp", label: "IPP / DMAPP", x: 350, y: 420, w: 110, h: 32, shape: "round_box", type: "standard", fillColor: "#f8fafc", strokeColor: "#e11d48" },
            { id: "node_lyc_fpp", label: "FPP", x: 350, y: 220, w: 90, h: 32, shape: "round_box", type: "standard", fillColor: "#f8fafc", strokeColor: "#e11d48" },
            { id: "node_lyc_ggpp", label: "GGPP", x: 550, y: 220, w: 90, h: 32, shape: "round_box", type: "standard", fillColor: "#f8fafc", strokeColor: "#e11d48" },
            { id: "node_lyc_phytoene", label: "Phytoene", x: 750, y: 220, w: 100, h: 32, shape: "round_box", type: "standard", fillColor: "#f8fafc", strokeColor: "#e11d48" },
            { id: "node_lyc_target", label: "Lycopene", x: 950, y: 100, w: 120, h: 36, shape: "round_box", type: "accent", fillColor: "#fff1f2", strokeColor: "#e11d48", textColor: "#9f1239" }
        ],
        targetArrows: [
            { id: "arr_accoa_to_acac", from: "node_1786344476268", to: "node_lyc_acac", type: "curved", curvature: 25, direction: "forward", geneSymbols: ["ERG10"] },
            { id: "arr_acac_to_hmg", from: "node_lyc_acac", to: "node_lyc_hmg", type: "straight", direction: "forward", geneSymbols: ["ERG13"] },
            { id: "arr_hmg_to_mev", from: "node_lyc_hmg", to: "node_lyc_mev", type: "straight", direction: "forward", geneSymbols: ["HMG1", "HMG2"] },
            { id: "arr_mev_to_ipp", from: "node_lyc_mev", to: "node_lyc_ipp", type: "straight", direction: "forward", geneSymbols: ["ERG12", "MVD1"] },
            { id: "arr_ipp_to_fpp", from: "node_lyc_ipp", to: "node_lyc_fpp", type: "straight", direction: "forward", geneSymbols: ["ERG20"] },
            { id: "arr_fpp_to_ggpp", from: "node_lyc_fpp", to: "node_lyc_ggpp", type: "straight", direction: "forward", geneSymbols: ["BTS1", "crtE"] },
            { id: "arr_ggpp_to_phytoene", from: "node_lyc_ggpp", to: "node_lyc_phytoene", type: "straight", direction: "forward", geneSymbols: ["crtB"] },
            { id: "arr_phytoene_to_lycopene", from: "node_lyc_phytoene", to: "node_lyc_target", type: "curved", curvature: -20, direction: "forward", geneSymbols: ["crtI"] }
        ],
        targetGenes: [
            { symbol: "ERG10", x: 58.0, y: 58.0, arrowId: "arr_accoa_to_acac" },
            { symbol: "ERG13", x: 45.0, y: 40.0, arrowId: "arr_acac_to_hmg" },
            { symbol: "HMG1", x: 34.5, y: 40.0, arrowId: "arr_hmg_to_mev" },
            { symbol: "ERG20", x: 18.5, y: 30.5, arrowId: "arr_ipp_to_fpp" },
            { symbol: "BTS1", x: 24.0, y: 21.0, arrowId: "arr_fpp_to_ggpp" }
        ],
        text: `Acetyl-CoA -> Acetoacetyl-CoA (ERG10)
Acetoacetyl-CoA -> HMG-CoA (ERG13)
HMG-CoA -> Mevalonate (HMG1, HMG2)
Mevalonate -> IPP / DMAPP (ERG12, MVD1)
IPP / DMAPP -> FPP (ERG20)
FPP -> GGPP (BTS1, crtE)
GGPP -> Phytoene (crtB)
Phytoene -> Lycopene (crtI)`
    },
    succinate: {
        id: "succinate",
        name: "숙신산 (Succinate) 글리옥실레이트 우회 대사공학 종합 경로",
        tag: "C4 플랫폼 유기산",
        desc: "TCA 사이클의 글리옥실레이트 우회로(ICL1, MLS1) 활성화 및 환원 경로를 통해 숙신산을 고수율로 축적하는 C4 유기산 대사공학 생산 지도",
        reactionsSummary: "Isocitrate -> Glyoxylate + Succinate (ICL1) + Glyoxylate + Acetyl-CoA -> Malate (MLS1) + Fumarate -> Succinate (FRD1)",
        targetZone: {
            id: "zone_target_succinate",
            label: "Reductive TCA & Glyoxylate Shunt for Succinate Accumulation",
            x: 350,
            y: 40,
            w: 830,
            h: 520,
            color: "cyan",
            titlePos: "top-left"
        },
        targetNodes: [
            { id: "node_suc_glyoxylate", label: "Glyoxylate", x: 880, y: 380, w: 100, h: 32, shape: "round_box", type: "standard", fillColor: "#f8fafc", strokeColor: "#0891b2" },
            { id: "node_suc_target", label: "Succinate (Target Pool)", x: 620, y: 160, w: 170, h: 36, shape: "round_box", type: "accent", fillColor: "#ecfeff", strokeColor: "#0891b2", textColor: "#155e75" }
        ],
        targetArrows: [
            { id: "arr_iso_to_glyoxylate", from: "node_1786343958711", to: "node_suc_glyoxylate", type: "curved", curvature: 25, direction: "forward", geneSymbols: ["ICL1"] },
            { id: "arr_iso_to_suctarget", from: "node_1786343958711", to: "node_suc_target", type: "curved", curvature: -35, direction: "forward", geneSymbols: ["ICL1"] },
            { id: "arr_glyox_to_malate", from: "node_suc_glyoxylate", to: "node_1786343961947", type: "curved", curvature: 30, direction: "forward", geneSymbols: ["MLS1"] },
            { id: "arr_fum_to_suctarget", from: "node_1786343955214", to: "node_suc_target", type: "curved", curvature: -25, direction: "forward", geneSymbols: ["FRD1", "OSM1"] }
        ],
        targetGenes: [
            { symbol: "ICL1", x: 51.0, y: 55.0, arrowId: "arr_iso_to_glyoxylate" },
            { symbol: "MLS1", x: 45.0, y: 65.0, arrowId: "arr_glyox_to_malate" },
            { symbol: "FRD1", x: 34.0, y: 35.0, arrowId: "arr_fum_to_suctarget" }
        ],
        text: `Isocitrate -> Glyoxylate + Succinate (ICL1)
Glyoxylate + Acetyl-CoA -> L-malate (MLS1)
Fumarate -> Succinate (FRD1, OSM1)`
    },
    isobutanol: {
        id: "isobutanol",
        name: "이소부탄올 (Isobutanol) 고급알코올 생산 대사공학 종합 경로",
        tag: "고급 바이오연료 / 알코올",
        desc: "피루브산(Pyruvate)에서 2-Acetolactate, 2,3-DHIV, 2-KIV를 거쳐 발린 생합성 및 엘리히 경로(ARO10, ADH6)로 합성되는 고효율 바이오 연료 생산 지도",
        reactionsSummary: "Pyruvate -> 2-Acetolactate -> 2,3-DHIV -> 2-Ketoisovalerate -> Isobutyraldehyde -> Isobutanol",
        targetZone: {
            id: "zone_target_isobutanol",
            label: "Ehrlich Pathway & Isobutanol Biosynthesis",
            x: 550,
            y: 40,
            w: 630,
            h: 520,
            color: "amber",
            titlePos: "top-left"
        },
        targetNodes: [
            { id: "node_ib_acetolactate", label: "2-Acetolactate", x: 950, y: 430, w: 125, h: 32, shape: "round_box", type: "standard", fillColor: "#f8fafc", strokeColor: "#d97706" },
            { id: "node_ib_dhiv", label: "2,3-DHIV", x: 740, y: 430, w: 90, h: 32, shape: "round_box", type: "standard", fillColor: "#f8fafc", strokeColor: "#d97706" },
            { id: "node_ib_kiv", label: "2-Ketoisovalerate", x: 740, y: 250, w: 135, h: 32, shape: "round_box", type: "standard", fillColor: "#f8fafc", strokeColor: "#d97706" },
            { id: "node_ib_aldehyde", label: "Isobutyraldehyde", x: 950, y: 250, w: 135, h: 32, shape: "round_box", type: "standard", fillColor: "#f8fafc", strokeColor: "#d97706" },
            { id: "node_ib_target", label: "Isobutanol", x: 950, y: 80, w: 130, h: 36, shape: "round_box", type: "accent", fillColor: "#fffbeb", strokeColor: "#d97706", textColor: "#92400e" }
        ],
        targetArrows: [
            { id: "arr_pyr_to_ibacetolactate", from: "node_1786344482445", to: "node_ib_acetolactate", type: "curved", curvature: 25, direction: "forward", geneSymbols: ["ILV2"] },
            { id: "arr_ibact_to_dhiv", from: "node_ib_acetolactate", to: "node_ib_dhiv", type: "straight", direction: "forward", geneSymbols: ["ILV5"] },
            { id: "arr_dhiv_to_kiv", from: "node_ib_dhiv", to: "node_ib_kiv", type: "straight", direction: "forward", geneSymbols: ["ILV3"] },
            { id: "arr_kiv_to_aldehyde", from: "node_ib_kiv", to: "node_ib_aldehyde", type: "straight", direction: "forward", geneSymbols: ["ARO10"] },
            { id: "arr_aldehyde_to_isobutanol", from: "node_ib_aldehyde", to: "node_ib_target", type: "straight", direction: "forward", geneSymbols: ["ADH6", "ADH7"] }
        ],
        targetGenes: [
            { symbol: "ILV2", x: 62.5, y: 55.0, arrowId: "arr_pyr_to_ibacetolactate" },
            { symbol: "ILV5", x: 45.0, y: 41.0, arrowId: "arr_ibact_to_dhiv" },
            { symbol: "ILV3", x: 39.0, y: 32.0, arrowId: "arr_dhiv_to_kiv" },
            { symbol: "ARO10", x: 45.0, y: 23.5, arrowId: "arr_kiv_to_aldehyde" },
            { symbol: "ADH6", x: 50.5, y: 15.0, arrowId: "arr_aldehyde_to_isobutanol" }
        ],
        text: `Pyruvate -> 2-Acetolactate (ILV2)
2-Acetolactate -> 2,3-DHIV (ILV5)
2,3-DHIV -> 2-Ketoisovalerate (ILV3)
2-Ketoisovalerate -> Isobutyraldehyde (ARO10)
Isobutyraldehyde -> Isobutanol (ADH6, ADH7)`
    }
};


// ======================================================================
// Comprehensive Metabolic Engineering Biosynthesis Knowledgebase
// ======================================================================
const METABOLIC_KNOWLEDGEBASE = {
    gsh: {
        id: "gsh",
        presetId: "gsh",
        aliases: ["gsh", "glutathione", "글루타치온", "gssg", "글루타티온"],
        name: "글루타치온 (Glutathione, GSH)",
        category: "항산화 조효소 / 바이오제약 / 세포공장",
        backbonePrecursor: "TCA Cycle의 α-Ketoglutarate 및 Serine/황 대사 Cysteine",
        backbonePrecursorDetail: "TCA 회로의 α-Ketoglutarate에서 GDH1/GLT1에 의해 L-Glutamate로 전환된 후, Cysteine/Glycine과 함께 GSH 합성으로 유입됩니다.",
        steps: ["α-Ketoglutarate", "L-Glutamate", "γ-Glutamylcysteine", "Glutathione (GSH)", "GSSG (산화형)"],
        enzymes: ["GDH1", "GLT1", "GSH1", "GSH2", "GLR1"],
        strategy: "GSH1 피드백 저해 완화 변이 도입, NADPH 공급 증대를 위한 ZWF1(PPP) 활성화, Cysteine 동화 경로(MET17/CYS4) 강화 권장.",
        description: "세포 내 산화 스트레스 방어 및 해독의 핵심 펩타이드로, TCA 회로와 황 동화 경로가 결합하여 합성됩니다."
    },
    nam: {
        id: "nam",
        presetId: "nam",
        aliases: ["nam", "nicotinamide", "니코틴아미드", "nad", "nad+", "nmn", "vitamin b3", "비타민b3"],
        name: "니코틴아미드 (Nicotinamide, NAM / NAD+)",
        category: "비타민 B3 / 바이오헬스 / 필수 조효소",
        backbonePrecursor: "TCA Cycle의 Oxaloacetate (OAA) → Aspartate",
        backbonePrecursorDetail: "TCA 회로의 옥살로아세테이트(OAA)가 Aspartate로 아미노전이된 후, 드 노보(De novo) 경로를 통해 Quinolinic acid 및 NaMN, NaAD, NAD+를 거쳐 NAM으로 생산됩니다.",
        steps: ["Oxaloacetate", "Aspartate", "Quinolinic acid", "NaMN", "NaAD", "NAD+", "Nicotinamide (NAM)"],
        enzymes: ["AAT2", "BNA6", "QPT1", "NMA1", "QNS1", "PNC1", "NPT1"],
        strategy: "Aspartate 산화효소 및 QPT1(퀴놀리네이트 포스포리보실전이효소) 과발현, PNC1 니코틴아미다아제 조절을 통한 NAM 축적 극대화.",
        description: "항노화, 미토콘드리아 에너지 대사 및 NAD+ 보충제의 주원료로 세포 대사의 산화환원 균형을 주도합니다."
    },
    bdo: {
        id: "bdo",
        presetId: "bdo",
        aliases: ["2,3-bdo", "bdo", "butanediol", "2,3-부탄디올", "부탄디올", "acetoin", "아세토인"],
        name: "2,3-부탄디올 (2,3-Butanediol, 2,3-BDO)",
        category: "플랫폼 바이오화학 / 청정 바이오연료",
        backbonePrecursor: "Glycolysis의 최종 산물인 Pyruvate (피루브산)",
        backbonePrecursorDetail: "해당과정의 Pyruvate 2분자가 결합하여 2-Acetolactate로 전환된 후 탈탄산 및 환원 반응을 거쳐 2,3-BDO로 합성됩니다.",
        steps: ["Pyruvate", "2-Acetolactate", "Acetoin", "2,3-Butanediol"],
        enzymes: ["ILV2", "ILV5", "AlsD", "BDH1", "BDH2"],
        strategy: "경쟁 발효 경로(Ethanol, Glycerol 등) 차단을 위한 PDC/GPD 결손 및 AlsS, AlsD, BDH 외래 오페론 도입.",
        description: "합성고무, 플라스틱, 솔벤트 및 친환경 항공유 전구체로 광범위하게 사용되는 C4 플랫폼 화학물질입니다."
    },
    naringenin: {
        id: "naringenin",
        presetId: "naringenin",
        aliases: ["naringenin", "나린게닌", "flavonoid", "플라보노이드", "chalcone"],
        name: "나린게닌 (Naringenin, 플라보노이드 골격)",
        category: "의약용 폴리페놀 / 기능성 파이토케미컬",
        backbonePrecursor: "해당과정(PEP) + 오탄당 인산(E4P) 및 Acetyl-CoA (Malonyl-CoA)",
        backbonePrecursorDetail: "Shikimate 경로 유래 L-Tyrosine과 아세틸-CoA 유래 3분자의 말로닐-CoA가 축합되어 합성됩니다.",
        steps: ["PEP + E4P", "Shikimate", "L-Tyrosine", "p-Coumarate", "4-Coumaroyl-CoA", "Naringenin chalcone", "Naringenin"],
        enzymes: ["ARO4", "TAL", "4CL", "CHS", "CHI", "ACC1"],
        strategy: "ARO4/ARO7 피드백 저해 해제, ACC1(아세틸-CoA 카르복실라아제) 변이 도입을 통한 Malonyl-CoA 풀 증대.",
        description: "항염증, 항암 활성을 지닌 플라보노이드 공통 전구체로, 식물 천연물 생합성의 대표적 엔지니어링 타깃입니다."
    },
    lycopene: {
        id: "lycopene",
        presetId: "lycopene",
        aliases: ["lycopene", "라이코펜", "리코펜", "carotenoid", "카로티노이드"],
        name: "라이코펜 (Lycopene, 테르페노이드/카로티노이드)",
        category: "항산화 색소 / 바이오헬스케어",
        backbonePrecursor: "Fermentation / 미토콘드리아의 Acetyl-CoA",
        backbonePrecursorDetail: "MVA(메발로네이트) 경로를 통해 합성된 IPP/DMAPP가 FPP, GGPP를 거쳐 Phytoene으로 축합된 후 불포화화되어 생성됩니다.",
        steps: ["Acetyl-CoA", "HMG-CoA", "Mevalonate", "IPP / DMAPP", "FPP", "GGPP", "Phytoene", "Lycopene"],
        enzymes: ["ERG10", "ERG13", "tHMG1", "ERG20", "crtE (BTS1)", "crtB", "crtI"],
        strategy: "율속 단계인 tHMG1 과발현, ERG9(스쿠알렌 경로) 하향조절로 카로티노이드 플럭스 집중 유도.",
        description: "토마토에 풍부한 붉은색 강력 항산화 카로티노이드로 기능성 식품 및 화장품 원료로 각광받습니다."
    },
    resveratrol: {
        id: "resveratrol",
        presetId: "naringenin",
        aliases: ["resveratrol", "레스베라트롤", "stilbene", "스틸벤"],
        name: "레스베라트롤 (Resveratrol, 스틸베노이드)",
        category: "항노화 폴리페놀 / 기능성 의약품",
        backbonePrecursor: "해당과정(PEP) + 오탄당 인산(E4P) 및 Acetyl-CoA",
        backbonePrecursorDetail: "Shikimate 경로 유래 p-Coumarate가 4CL에 의해 활성화된 후, 스틸벤 합성효소(STS)에 의해 3분자의 Malonyl-CoA와 축합됩니다.",
        steps: ["PEP + E4P", "Tyrosine / Phenylalanine", "p-Coumarate", "4-Coumaroyl-CoA", "Resveratrol"],
        enzymes: ["PAL", "TAL", "4CL", "STS", "ACC1"],
        strategy: "식물 유래 STS 과발현 및 NADPH, ATP 공급 강화, Malonyl-CoA 생합성 경로 활성화.",
        description: "포도와 레드와인에 함유된 항산화/수명연장 성분으로 Sirtuin을 활성화하는 대사물질입니다."
    },
    succinate: {
        id: "succinate",
        presetId: "succinate",
        aliases: ["succinate", "succinic acid", "숙신산", "호박산"],
        name: "숙신산 (Succinate, C4 디카르복실산)",
        category: "바이오플라스틱(PBS) / 플랫폼 유기산",
        backbonePrecursor: "TCA Cycle의 Isocitrate 및 Acetyl-CoA",
        backbonePrecursorDetail: "TCA 회로의 탈수소 반응을 거치거나 글리옥실레이트 우회로(ICL1/MLS1) 및 환원성 TCA 경로를 통해 합성됩니다.",
        steps: ["Isocitrate", "Glyoxylate + Succinate", "L-malate", "Fumarate", "Succinate"],
        enzymes: ["ICL1", "MLS1", "MDH1", "FUM1", "FRD1", "SDH1"],
        strategy: "SDH(숙신산 탈수소효소) 결손으로 분해 억제, 글리옥실레이트 회로 활성화 및 환원성 TCA 강화.",
        description: "생분해성 플라스틱 PBS의 핵심 단량체이자 석유 유래 화학물질을 대체하는 대표 바이오 기반 유기산입니다."
    },
    isobutanol: {
        id: "isobutanol",
        presetId: "isobutanol",
        aliases: ["isobutanol", "이소부탄올", "bio-isobutanol", "고급알코올"],
        name: "이소부탄올 (Isobutanol, C4 고급 바이오알코올)",
        category: "차세대 수송용 바이오연료 / 항공유",
        backbonePrecursor: "Glycolysis의 Pyruvate (피루브산)",
        backbonePrecursorDetail: "Pyruvate에서 발린 생합성 경로(ILV2, ILV5, ILV3)를 거쳐 2-Ketoisovalerate 생성 후 엘리히 경로(ARO10, ADH6)로 합성됩니다.",
        steps: ["Pyruvate", "2-Acetolactate", "2,3-DHIV", "2-Ketoisovalerate", "Isobutyraldehyde", "Isobutanol"],
        enzymes: ["ILV2", "ILV5", "ILV3", "ARO10", "ADH6"],
        strategy: "미토콘드리아 경로를 세포질로 재배치, KARI 효소 보조인자 선호도를 NADH로 엔지니어링.",
        description: "에탄올보다 높은 에너지 밀도와 낮은 흡습성을 지녀 기존 내연기관에 100% 직접 사용 가능한 차세대 연료입니다."
    },
    lysine: {
        id: "lysine",
        presetId: "nam",
        aliases: ["lysine", "l-lysine", "라이신", "l-라이신", "리신"],
        name: "L-라이신 (L-Lysine, 필수 아미노산)",
        category: "동물 사료 첨가제 / 산업용 필수 아미노산",
        backbonePrecursor: "TCA Cycle의 Oxaloacetate (OAA) → Aspartate",
        backbonePrecursorDetail: "TCA 회로의 옥살로아세테이트에서 아스파르테이트 패밀리 경로(dapA/B/D, lysA)를 거쳐 대량 합성됩니다.",
        steps: ["Oxaloacetate", "Aspartate", "Aspartyl-P", "Aspartate-semialdehyde", "Dihydrodipicolinate", "DAP", "L-Lysine"],
        enzymes: ["AAT2", "LYS1", "HOM3", "dapA", "dapB", "lysA"],
        strategy: "아스파르토키나아제(lysC) 피드백 저해 해제, 중심 대사 옥살로아세테이트(OAA) 전구체 공급 증대.",
        description: "코리네박테리움(C. glutamicum) 등에서 수백만 톤 규모로 발효 생산되는 대표적인 산업 아미노산입니다."
    },
    gaba: {
        id: "gaba",
        presetId: "gsh",
        aliases: ["gaba", "gamma-aminobutyric acid", "가바", "감마아미노낙산"],
        name: "GABA (감마-아미노부티르산)",
        category: "신경전달물질 / 뇌 건강 바이오헬스케어",
        backbonePrecursor: "TCA Cycle의 α-Ketoglutarate → Glutamate",
        backbonePrecursorDetail: "TCA 회로의 α-Ketoglutarate가 Glutamate로 전환된 후, 글루타메이트 탈탄산효소(GAD)에 의해 생산됩니다.",
        steps: ["α-Ketoglutarate", "L-Glutamate", "GABA"],
        enzymes: ["GDH1", "GLT1", "GAD1", "gadB"],
        strategy: "글루타메이트 탈탄산효소(GAD) 발현 강화 및 GABA 트랜스아미나아제(분해효소) 차단.",
        description: "스트레스 완화, 수면 유도 및 혈압 강하 효과를 가진 기능성 식품 및 의약품 소재입니다."
    },
    vanillin: {
        id: "vanillin",
        presetId: "naringenin",
        aliases: ["vanillin", "바닐린", "바닐라"],
        name: "바닐린 (Vanillin, 천연 바닐라 향미 성분)",
        category: "식품 향료 / 천연 아로마 화학",
        backbonePrecursor: "해당과정(PEP) + 오탄당 인산(E4P) Shikimate 경로",
        backbonePrecursorDetail: "Shikimate 경로의 중간체인 3-Dehydroshikimate(3-DHS)에서 방향족 고리 개질을 통해 합성됩니다.",
        steps: ["PEP + E4P", "3-Dehydroshikimate", "Protocatechuate", "Vanillate", "Vanillin"],
        enzymes: ["ARO4", "aroZ", "COMT", "ACR"],
        strategy: "Shikimate 탈수효소(aroZ) 및 카르복실산 환원효소(ACR) 도입, 알코올(바닐릴알코올) 환원 억제.",
        description: "전 세계에서 가장 널리 쓰이는 천연 향료로 미생물 세포공장을 통한 청정 대량 생산 연구가 활발합니다."
    },
    beta_carotene: {
        id: "beta_carotene",
        presetId: "lycopene",
        aliases: ["beta-carotene", "carotene", "베타카로틴", "카로틴", "프로비타민a"],
        name: "베타카로틴 (β-Carotene, 프로비타민 A)",
        category: "비타민 전구체 / 기능성 항산화 색소",
        backbonePrecursor: "미토콘드리아 / 세포질의 Acetyl-CoA (테르페노이드 경로)",
        backbonePrecursorDetail: "라이코펜(Lycopene)의 양 말단이 라이코펜 사이클라아제(crtY / crtYB)에 의해 고리화되어 형성됩니다.",
        steps: ["Acetyl-CoA", "Mevalonate", "FPP / GGPP", "Phytoene", "Lycopene", "β-Carotene"],
        enzymes: ["tHMG1", "crtE", "crtB", "crtI", "crtYB"],
        strategy: "MVA 경로 탄소 유동 최적화 및 이중 기능 사이클라아제(crtYB) 고발현.",
        description: "인체 내에서 비타민 A로 전환되는 필수 영양소이자 천연 황색/주황색 색소입니다."
    }
};

let gSelectedAutoPresetId = "gsh";
let gCurrentInferredItem = null;

function initAutoPathwayWizard() {
    const btnOpen = document.getElementById("btn-open-auto-pathway-wizard");
    const modal = document.getElementById("auto-pathway-wizard-modal");
    const btnClose = document.getElementById("btn-close-auto-pathway-modal");
    const btnCancel = document.getElementById("btn-cancel-auto-pathway");
    const btnSubmit = document.getElementById("btn-submit-auto-pathway");
    
    if (!btnOpen || !modal) return;
    
    // Subtab elements
    const tabSearch = document.getElementById("btn-auto-tab-search");
    const tabPreset = document.getElementById("btn-auto-tab-preset");
    const tabText = document.getElementById("btn-auto-tab-text");
    const secSearch = document.getElementById("auto-section-search");
    const secPreset = document.getElementById("auto-section-preset");
    const secText = document.getElementById("auto-section-text");
    
    let activeSubtab = "search";
    
    const switchSubtab = (target) => {
        activeSubtab = target;
        [tabSearch, tabPreset, tabText].forEach(t => {
            if (!t) return;
            t.classList.remove("active");
            t.style.borderBottom = "2px solid transparent";
            t.style.color = "#64748b";
        });
        [secSearch, secPreset, secText].forEach(s => {
            if (!s) return;
            s.style.display = "none";
        });
        
        if (target === "search" && tabSearch && secSearch) {
            tabSearch.classList.add("active");
            tabSearch.style.borderBottom = "2px solid #6366f1";
            tabSearch.style.color = "#6366f1";
            secSearch.style.display = "block";
        } else if (target === "preset" && tabPreset && secPreset) {
            tabPreset.classList.add("active");
            tabPreset.style.borderBottom = "2px solid #6366f1";
            tabPreset.style.color = "#6366f1";
            secPreset.style.display = "block";
        } else if (target === "text" && tabText && secText) {
            tabText.classList.add("active");
            tabText.style.borderBottom = "2px solid #6366f1";
            tabText.style.color = "#6366f1";
            secText.style.display = "block";
        }
    };
    
    if (tabSearch) tabSearch.addEventListener("click", () => switchSubtab("search"));
    if (tabPreset) tabPreset.addEventListener("click", () => switchSubtab("preset"));
    if (tabText) tabText.addEventListener("click", () => switchSubtab("text"));
    
    // Search input listener
    const searchInput = document.getElementById("auto-search-metabolite-input");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            searchMetaboliteKnowledgebase(e.target.value.trim());
        });
    }
    
    // Quick suggestion chip listeners
    document.querySelectorAll("#auto-search-chips .btn-chip").forEach(chip => {
        chip.addEventListener("click", () => {
            const targetKey = chip.getAttribute("data-target");
            selectKnowledgebaseItem(targetKey);
        });
    });
    
    // Render preset cards for preset tab
    renderAutoPresetCards();
    
    // Open modal
    btnOpen.addEventListener("click", () => {
        modal.style.display = "flex";
        switchSubtab("search");
        selectKnowledgebaseItem("gsh");
    });
    
    // Close modal
    const closeModal = () => { modal.style.display = "none"; };
    if (btnClose) btnClose.addEventListener("click", closeModal);
    if (btnCancel) btnCancel.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });
    
    // Quick template buttons inside text tab
    document.querySelectorAll(".btn-quick-template").forEach(btn => {
        btn.addEventListener("click", () => {
            const pid = btn.getAttribute("data-preset");
            const preset = AUTO_PATHWAY_PRESETS[pid];
            if (preset) {
                const nameInput = document.getElementById("auto-pathway-name");
                const textArea = document.getElementById("auto-pathway-textarea");
                if (nameInput) nameInput.value = preset.name;
                if (textArea) textArea.value = preset.text;
            }
        });
    });
    
    // Submit auto pathway generation
    if (btnSubmit) {
        btnSubmit.addEventListener("click", () => {
            let mapName = "";
            let reactionText = "";
            let direction = "TB";
            let presetObj = null;
            
            const dirRadio = document.querySelector('input[name="auto-layout-direction"]:checked');
            if (dirRadio) direction = dirRadio.value;
            
            const checkIncludeBackbone = document.getElementById("check-auto-include-backbone");
            const includeBackbone = checkIncludeBackbone ? checkIncludeBackbone.checked : true;
            
            if (activeSubtab === "search") {
                if (!gCurrentInferredItem) {
                    selectKnowledgebaseItem("gsh");
                }
                const item = gCurrentInferredItem;
                mapName = item.name + " 대사공학 종합 생산 지도";
                if (item.presetId && AUTO_PATHWAY_PRESETS[item.presetId]) {
                    presetObj = AUTO_PATHWAY_PRESETS[item.presetId];
                    reactionText = presetObj.text;
                } else if (item.reactionsText) {
                    reactionText = item.reactionsText;
                } else if (item.steps && item.steps.length >= 2) {
                    const lines = [];
                    for (let i = 0; i < item.steps.length - 1; i++) {
                        const enz = (item.enzymes && item.enzymes[i]) ? ` (${item.enzymes[i]})` : "";
                        lines.push(`${item.steps[i]} -> ${item.steps[i+1]}${enz}`);
                    }
                    reactionText = lines.join("\n");
                }
            } else if (activeSubtab === "preset") {
                presetObj = AUTO_PATHWAY_PRESETS[gSelectedAutoPresetId];
                if (!presetObj) {
                    alert("선택된 프리셋이 없습니다.");
                    return;
                }
                mapName = presetObj.name;
                reactionText = presetObj.text;
            } else {
                const nameInput = document.getElementById("auto-pathway-name");
                const textArea = document.getElementById("auto-pathway-textarea");
                mapName = nameInput ? nameInput.value.trim() : "";
                reactionText = textArea ? textArea.value.trim() : "";
                
                if (!mapName) {
                    mapName = "맞춤형 대사경로 (" + new Date().toLocaleTimeString() + ")";
                }
                if (!reactionText) {
                    alert("반응식을 입력하거나 빠른 템플릿을 선택해주세요.");
                    return;
                }
            }
            
            generateIntegratedAutoPathway(mapName, reactionText, direction, presetObj, includeBackbone);
            closeModal();
        });
    }
}

function selectKnowledgebaseItem(targetKey) {
    const searchInput = document.getElementById("auto-search-metabolite-input");
    const item = METABOLIC_KNOWLEDGEBASE[targetKey];
    if (item && searchInput) {
        searchInput.value = item.name.split(" ")[0];
    }
    
    // Highlight active chip
    document.querySelectorAll("#auto-search-chips .btn-chip").forEach(c => {
        if (c.getAttribute("data-target") === targetKey) {
            c.style.background = "#6366f1";
            c.style.color = "#ffffff";
            c.style.borderColor = "#6366f1";
            c.style.fontWeight = "700";
        } else {
            c.style.background = "#ffffff";
            c.style.color = "#334155";
            c.style.borderColor = "#cbd5e1";
            c.style.fontWeight = "400";
        }
    });
    
    searchMetaboliteKnowledgebase(targetKey);
}

function searchMetaboliteKnowledgebase(query) {
    if (!query) {
        query = "gsh";
    }
    const qClean = query.toLowerCase().replace(/[^a-z0-9가-힣]/g, "");
    
    let matchedItem = null;
    let highestScore = -1;
    
    Object.values(METABOLIC_KNOWLEDGEBASE).forEach(item => {
        let score = 0;
        if (item.id === qClean) score += 100;
        if (item.aliases) {
            item.aliases.forEach(alias => {
                const aClean = alias.toLowerCase().replace(/[^a-z0-9가-힣]/g, "");
                if (aClean === qClean) score += 80;
                else if (aClean.includes(qClean) || qClean.includes(aClean)) score += 40;
            });
        }
        if (item.name.toLowerCase().includes(qClean)) score += 30;
        if (item.category && item.category.toLowerCase().includes(qClean)) score += 10;
        if (item.description && item.description.toLowerCase().includes(qClean)) score += 10;
        
        if (score > highestScore && score > 0) {
            highestScore = score;
            matchedItem = item;
        }
    });
    
    if (!matchedItem) {
        // Dynamic custom fallback inference
        matchedItem = {
            id: "custom_" + Date.now(),
            name: `${query} 생합성 경로`,
            category: "사용자 맞춤형 타깃 대사산물",
            backbonePrecursor: "해당과정 Pyruvate 또는 아세틸-CoA (Acetyl-CoA)",
            backbonePrecursorDetail: `중심 탄소 대사의 핵심 전구체(Pyruvate / Acetyl-CoA)로부터 효소 반응 단계를 거쳐 ${query}로 유도되는 생합성 경로`,
            steps: ["Pyruvate / Acetyl-CoA", "Intermediate-1", "Intermediate-2", query],
            enzymes: ["ENZ1", "ENZ2", "ENZ3"],
            strategy: `전구체 탄소 유동 공급 증대 및 ${query} 생합성 율속 효소 과발현`,
            description: `입력된 타깃 대사물질 '${query}'을 생산하기 위해 중심 탄소 대사와 유기적으로 연결되는 경로입니다.`,
            reactionsText: `Pyruvate -> Intermediate-1 (ENZ1)\nIntermediate-1 -> Intermediate-2 (ENZ2)\nIntermediate-2 -> ${query} (ENZ3)`
        };
    }
    
    renderInferredPathwayCard(matchedItem);
}

function renderInferredPathwayCard(item) {
    gCurrentInferredItem = item;
    
    const titleEl = document.getElementById("inferred-target-title");
    const badgeEl = document.getElementById("inferred-target-badge");
    const descEl = document.getElementById("inferred-target-desc");
    const precNameEl = document.getElementById("inferred-precursor-name");
    const precDetailEl = document.getElementById("inferred-precursor-detail");
    const flowContainer = document.getElementById("inferred-flow-container");
    const genesContainer = document.getElementById("inferred-genes-container");
    const strategyEl = document.getElementById("inferred-strategy-text");
    
    if (titleEl) titleEl.innerText = item.name;
    if (badgeEl) badgeEl.innerText = item.category;
    if (descEl) descEl.innerText = item.description || "";
    if (precNameEl) precNameEl.innerText = item.backbonePrecursor || "중심 탄소 대사";
    if (precDetailEl) precDetailEl.innerText = item.backbonePrecursorDetail || "";
    
    if (flowContainer && item.steps) {
        flowContainer.innerHTML = "";
        item.steps.forEach((step, idx) => {
            const isLast = idx === item.steps.length - 1;
            const stepBadge = document.createElement("span");
            stepBadge.style.cssText = isLast
                ? "background: #10b981; color: white; padding: 3px 10px; border-radius: 12px; font-weight: 700; box-shadow: 0 1px 3px rgba(16,185,129,0.3);"
                : "background: #ffffff; color: #1e293b; border: 1px solid #cbd5e1; padding: 3px 8px; border-radius: 12px; font-weight: 600;";
            stepBadge.innerText = step;
            flowContainer.appendChild(stepBadge);
            
            if (!isLast) {
                const arrowIcon = document.createElement("i");
                arrowIcon.className = "fa-solid fa-arrow-right";
                arrowIcon.style.cssText = "color: #6366f1; font-size: 10px; margin: 0 2px;";
                flowContainer.appendChild(arrowIcon);
            }
        });
    }
    
    if (genesContainer) {
        genesContainer.innerHTML = "";
        if (item.enzymes && item.enzymes.length > 0) {
            item.enzymes.forEach(gene => {
                const gBadge = document.createElement("span");
                gBadge.className = "badge";
                gBadge.style.cssText = "background: #eef2ff; color: #4338ca; border: 1px solid #c7d2fe; font-size: 11px; padding: 2px 8px; border-radius: 4px; font-weight: 600;";
                gBadge.innerText = gene;
                genesContainer.appendChild(gBadge);
            });
        } else {
            genesContainer.innerHTML = "<span style='font-size: 11px; color: #94a3b8;'>해당 타깃 효소 정보가 기본 모델에 연결됩니다.</span>";
        }
    }
    
    if (strategyEl) {
        strategyEl.innerText = item.strategy || "중심 탄소 대사 전구체 풀 확보 및 율속 효소 과발현";
    }
}

function renderAutoPresetCards() {
    const container = document.getElementById("auto-preset-cards");
    if (!container) return;
    
    container.innerHTML = "";
    Object.values(AUTO_PATHWAY_PRESETS).forEach(p => {
        const card = document.createElement("div");
        card.className = "auto-preset-card";
        card.setAttribute("data-id", p.id);
        card.style.cssText = `
            border: 1px solid #cbd5e1;
            border-radius: 6px;
            padding: 10px;
            background: #ffffff;
            cursor: pointer;
            transition: all 0.2s ease;
        `;
        
        card.innerHTML = `
            <div style="font-size: 10px; color: #6366f1; font-weight: 700; margin-bottom: 2px;">${p.tag || "대사공학"}</div>
            <div style="font-size: 12px; font-weight: 700; color: #1e293b; margin-bottom: 4px;">${p.name.split(" ")[0]}</div>
            <div style="font-size: 10px; color: #64748b; line-height: 1.3; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
                ${p.reactionsSummary || p.desc}
            </div>
        `;
        
        card.addEventListener("click", () => {
            selectAutoPreset(p.id);
        });
        
        container.appendChild(card);
    });
}

function selectAutoPreset(presetId) {
    gSelectedAutoPresetId = presetId;
    const preset = AUTO_PATHWAY_PRESETS[presetId];
    if (!preset) return;
    
    document.querySelectorAll(".auto-preset-card").forEach(c => {
        if (c.getAttribute("data-id") === presetId) {
            c.style.borderColor = "#6366f1";
            c.style.background = "#eef2ff";
            c.style.boxShadow = "0 0 0 1px #6366f1";
        } else {
            c.style.borderColor = "#cbd5e1";
            c.style.background = "#ffffff";
            c.style.boxShadow = "none";
        }
    });
    
    const detailBox = document.getElementById("auto-preset-detail-box");
    const detailTitle = document.getElementById("auto-preset-detail-title");
    const detailTag = document.getElementById("auto-preset-detail-tag");
    const detailDesc = document.getElementById("auto-preset-detail-desc");
    const detailSteps = document.getElementById("auto-preset-detail-steps");
    
    if (detailBox) detailBox.style.display = "block";
    if (detailTitle) detailTitle.innerText = preset.name;
    if (detailTag) detailTag.innerText = preset.tag || "대사공학 프리셋";
    if (detailDesc) detailDesc.innerText = preset.desc || "";
    if (detailSteps) detailSteps.innerText = preset.reactionsSummary || preset.text;
}

function layoutTargetBoxDAG(nodes, arrows, direction, boxArea) {
    const nodeLookup = {};
    const inDegree = {};
    const adj = {};
    
    nodes.forEach(n => {
        nodeLookup[n.id] = n;
        inDegree[n.id] = 0;
        adj[n.id] = [];
    });
    
    arrows.forEach(a => {
        if (adj[a.from]) adj[a.from].push(a.to);
        if (inDegree[a.to] !== undefined) inDegree[a.to]++;
    });
    
    const ranks = {};
    const queue = [];
    nodes.forEach(n => {
        if (inDegree[n.id] === 0) {
            queue.push(n.id);
            ranks[n.id] = 0;
        }
    });
    
    if (queue.length === 0 && nodes.length > 0) {
        queue.push(nodes[0].id);
        ranks[nodes[0].id] = 0;
    }
    
    let maxRank = 0;
    while (queue.length > 0) {
        const curr = queue.shift();
        const r = ranks[curr] || 0;
        (adj[curr] || []).forEach(nxt => {
            if (ranks[nxt] === undefined || ranks[nxt] < r + 1) {
                ranks[nxt] = r + 1;
                if (ranks[nxt] > maxRank) maxRank = ranks[nxt];
                queue.push(nxt);
            }
        });
    }
    
    const rankBuckets = {};
    for (let i = 0; i <= maxRank; i++) rankBuckets[i] = [];
    nodes.forEach(n => {
        const r = ranks[n.id] || 0;
        rankBuckets[r].push(n);
    });
    
    const totalRanks = maxRank + 1;
    const stepY = (boxArea.h - 60) / Math.max(totalRanks, 1);
    
    Object.keys(rankBuckets).forEach(rStr => {
        const r = parseInt(rStr, 10);
        const bucket = rankBuckets[r];
        const stepX = (boxArea.w - 40) / Math.max(bucket.length + 1, 2);
        
        bucket.forEach((node, idx) => {
            node.x = Math.round(boxArea.x + 20 + stepX * (idx + 1) - node.w / 2);
            node.y = Math.round(boxArea.y + 40 + stepY * r);
            
            node.fillColor = (r === maxRank) ? "#d1fae5" : "#f8fafc";
            node.strokeColor = (r === maxRank) ? "#059669" : "#64748b";
            if (r === maxRank) node.textColor = "#065f46";
            
            nodeLookup[node.id] = node;
        });
    });
    
    arrows.forEach(arrow => {
        const fromNode = nodeLookup[arrow.from];
        const toNode = nodeLookup[arrow.to];
        if (!fromNode || !toNode) return;
        
        const midX = Math.round((fromNode.x + fromNode.w / 2 + toNode.x + toNode.w / 2) / 2);
        const midY = Math.round((fromNode.y + fromNode.h / 2 + toNode.y + toNode.h / 2) / 2);
        
        arrow.type = "straight";
        arrow.geneOffset = { x: midX + 16, y: midY - 10 };
    });
    
    return { nodes: nodes, arrows: arrows };
}


// ----------------------------------------------------------------------
// 10-3. Integrated Metabolic Pathway Generation Engine
//      (Central Carbon Backbone + Target Pathway Docking)
// ----------------------------------------------------------------------

function generateIntegratedAutoPathway(mapName, reactionText, direction = "TB", presetObj = null, includeBackbone = true) {
    try {
        const newMapId = `auto_map_${Date.now()}`;
        let finalNodes = [];
        let finalArrows = [];
        let finalZones = [];
        let customGeneList = [];
        
        const mapWidth = 1880;
        const mapHeight = 1050;
        
        // 1. If includeBackbone is true, load Foundational Central Carbon Metabolism (Glycolysis, PPP, Fermentation, TCA)
        if (includeBackbone) {
            const backboneCopy = JSON.parse(JSON.stringify(CENTRAL_CARBON_BACKBONE_DATA));
            finalNodes = backboneCopy.nodes || [];
            finalArrows = backboneCopy.arrows || [];
            finalZones = backboneCopy.zones || [];
            
            // Central backbone genes
            (backboneCopy.customGenes || []).forEach(cg => {
                customGeneList.push(cg);
            });
        }
        
        // Lookup map for existing nodes to allow smart docking
        const nodeLabelToNode = {};
        finalNodes.forEach(n => {
            nodeLabelToNode[n.label.toLowerCase().replace(/[^a-z0-9]/g, "")] = n;
        });
        
        // 2. Add Target Biosynthetic Pathway
        if (presetObj && presetObj.targetNodes && presetObj.targetNodes.length > 0) {
            // Use Pre-curated High Quality Metabolic Engineering Model
            if (presetObj.targetZone) {
                finalZones.unshift(JSON.parse(JSON.stringify(presetObj.targetZone)));
            }
            
            (presetObj.targetNodes || []).forEach(tn => {
                finalNodes.push(JSON.parse(JSON.stringify(tn)));
            });
            
            (presetObj.targetArrows || []).forEach(ta => {
                finalArrows.push(JSON.parse(JSON.stringify(ta)));
            });
            
            (presetObj.dockingArrows || []).forEach(da => {
                finalArrows.push(JSON.parse(JSON.stringify(da)));
            });
            
            let gIdx = 0;
            const presetGeneSource = presetObj.targetGenes || presetObj.customGenes || [];
            presetGeneSource.forEach(tg => {
                const cleanSym = tg.symbol.toUpperCase();
                let repLog2fc = 0.0;
                let geneIsoforms = [];
                if (window.gGenes && window.gGenes.length > 0) {
                    const match = window.gGenes.find(g => (g.gene_symbol && g.gene_symbol.toUpperCase() === cleanSym) || (g.locus_tag && g.locus_tag.toUpperCase() === cleanSym));
                    if (match) {
                        repLog2fc = parseFloat(match.log2fc) || 0.0;
                        geneIsoforms = [match];
                    }
                }
                
                customGeneList.push({
                    id: tg.id || `gene_${Date.now()}_${gIdx++}`,
                    symbol: cleanSym,
                    x: tg.x,
                    y: tg.y,
                    arrowId: tg.arrowId || null,
                    rep_log2fc: repLog2fc,
                    genes: geneIsoforms
                });
            });
            
        } else {
            // User Custom Reaction Text Parser & Intelligent Auto-Docking
            const parsed = parsePathwayTextToGraph(reactionText);
            if (!parsed.nodes || parsed.nodes.length === 0) {
                alert("유효한 대사 반응이나 노드를 파싱할 수 없습니다. 반응식 문법을 확인해 주세요.");
                return;
            }
            
            // Check if any parsed nodes match backbone nodes (e.g. Pyruvate, Acetyl-CoA, PEP, Glucose)
            const targetOnlyNodes = [];
            const targetOnlyNodeIds = new Set();
            const dockingLinks = [];
            
            parsed.nodes.forEach(pn => {
                const normKey = pn.label.toLowerCase().replace(/[^a-z0-9]/g, "");
                if (nodeLabelToNode[normKey]) {
                    dockingLinks.push({ inputId: pn.id, backboneNode: nodeLabelToNode[normKey] });
                } else {
                    targetOnlyNodes.push(pn);
                    targetOnlyNodeIds.add(pn.id);
                }
            });
            
            // Target Box Coordinates on canvas (Top-Left area, leaving right & bottom for Glycolysis/TCA)
            const targetBoxArea = includeBackbone 
                ? { x: 80, y: 50, w: 1040, h: 500 }
                : { x: 80, y: 50, w: 1000, h: 600 };
                
            const layoutRes = layoutTargetBoxDAG(targetOnlyNodes, parsed.arrows.filter(a => targetOnlyNodeIds.has(a.from) && targetOnlyNodeIds.has(a.to)), direction, targetBoxArea);
            
            // Add Target Zone Box
            const targetZoneId = `zone_target_${Date.now()}`;
            finalZones.unshift({
                id: targetZoneId,
                label: `${mapName} Biosynthetic Engineering Pathway`,
                x: targetBoxArea.x - 20,
                y: targetBoxArea.y - 10,
                w: targetBoxArea.w + 40,
                h: targetBoxArea.h + 30,
                color: "emerald",
                titlePos: "top-left"
            });
            
            // Add Target Nodes
            layoutRes.nodes.forEach(tn => finalNodes.push(tn));
            
            // Add Target Internal Arrows
            layoutRes.arrows.forEach(ta => finalArrows.push(ta));
            
            // Connect Docking Arrows from Backbone (e.g. Backbone Pyruvate -> Target 2-Acetolactate)
            const inputIdToBackbone = {};
            dockingLinks.forEach(dl => {
                inputIdToBackbone[dl.inputId] = dl.backboneNode;
            });
            
            parsed.arrows.forEach(arr => {
                const fromIsDocked = inputIdToBackbone[arr.from];
                const toIsTarget = targetOnlyNodeIds.has(arr.to);
                if (fromIsDocked && toIsTarget) {
                    const dockArrId = `arr_dock_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
                    finalArrows.push({
                        id: dockArrId,
                        from: fromIsDocked.id,
                        to: arr.to,
                        type: "curved",
                        curvature: 25,
                        direction: "forward",
                        geneSymbols: arr.geneSymbols || []
                    });
                }
            });
            
            // Register Gene Badges for parsed arrows
            let pGeneIdx = 0;
            finalArrows.forEach(arr => {
                if (arr.geneSymbols && arr.geneSymbols.length > 0) {
                    arr.geneSymbols.forEach(sym => {
                        const cleanSym = sym.trim().toUpperCase();
                        let repLog2fc = 0.0;
                        let geneIsoforms = [];
                        if (window.gGenes && window.gGenes.length > 0) {
                            const match = window.gGenes.find(g => (g.gene_symbol && g.gene_symbol.toUpperCase() === cleanSym) || (g.locus_tag && g.locus_tag.toUpperCase() === cleanSym));
                            if (match) {
                                repLog2fc = parseFloat(match.log2fc) || 0.0;
                                geneIsoforms = [match];
                            }
                        }
                        
                        const normX = Math.round((arr.geneOffset ? arr.geneOffset.x : 200) / mapWidth * 100);
                        const normY = Math.round((arr.geneOffset ? arr.geneOffset.y : 200) / mapHeight * 100);
                        
                        customGeneList.push({
                            id: `gene_auto_${Date.now()}_${pGeneIdx++}`,
                            symbol: cleanSym,
                            x: normX,
                            y: normY,
                            arrowId: arr.id,
                            rep_log2fc: repLog2fc,
                            genes: geneIsoforms
                        });
                    });
                }
            });
        }
        
        // 3. Register to pathwayMapsStore & Persist
        if (!pathwayMapsStore) pathwayMapsStore = {};
        
        pathwayMapsStore[newMapId] = {
            name: mapName,
            species: gCurrentSpecies || "sce",
            width: mapWidth,
            height: mapHeight,
            nodes: finalNodes,
            arrows: finalArrows,
            zones: finalZones,
            customGenes: customGeneList
        };
        
        setGshCustomGenes(newMapId, customGeneList);
        saveAllPathwayMaps();
        
        // 4. Switch to new map and render immediately
        currentMapId = newMapId;
        initializeMapDropdown();
        selectAndLoadMap(newMapId);
        
        showGshToast(`🎉 '${mapName}' 대사공학 종합 생산 지도가 생성되었습니다! (중심 당 대사, PPP, 발효, TCA 사이클 및 타깃 생합성 경로 완벽 통합)`);
    } catch (err) {
        console.error("Integrated auto pathway generation failed:", err);
        alert(`종합 경로 생성 중 오류 발생: ${err.message}`);
    }
}

