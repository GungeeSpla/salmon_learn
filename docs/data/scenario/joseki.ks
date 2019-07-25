
;=======================================
*BaMK_Joseki_A
;=======================================
[cm]
[iscript]
f.joseki = "BaMK_Joseki_A"
[endscript]

[k_button  k=C target=*BaMK_Joseki_A_1]
[yajirushi k=C]
[s]

*BaMK_Joseki_A_1
[k_check][jump cond=f.atari target=*Atari][cm]
[if exp="gusherApp.isBrother('C', f.answer)"]
    [yajirushi_move k=B]
    [k_button       k=B target=*BaMK_Joseki_A_2]
[else]
    [yajirushi_move k=H]
    [k_button       k=H target=*BaMK_Joseki_A_3]
[endif]
[s]

*BaMK_Joseki_A_2
[k_check][jump cond=f.atari target=*Atari][cm]
[yajirushi_move k=E]
[k_button       k=E target=*Kakutei]
[s]

*BaMK_Joseki_A_3
[k_check][jump cond=f.atari target=*Atari][cm]
[yajirushi_move k=I]
[k_button       k=I target=*Kakutei]
[s]

;=======================================
*BaTK_Joseki_B
;=======================================
[cm]
[iscript]
f.joseki = "BaTK_Joseki_B"
[endscript]

[k_button  k=H target=*BaTK_Joseki_B_1]
[yajirushi k=H]
[s]

*BaTK_Joseki_B_1
[k_check][jump cond=f.atari target=*Atari][cm]
[if exp="gusherApp.isBrother('H', f.answer)"]
    [yajirushi_move k=G]
    [k_button       k=G target=*BaTK_Joseki_B_2]
[else]
	[ptext layer=1 color=0x000000 text=※奥は後回しにするほうが手数的には最短 name=hosoku size=20 x=50 y=110 width=570]
    [yajirushi_move k=D]
    [k_button       k=D target=*BaTK_Joseki_B_4]
[endif]
[s]

*BaTK_Joseki_B_2
[k_check][jump cond=f.atari target=*Atari][cm]
[if exp="gusherApp.isBrother('G', f.answer)"]
    [yajirushi_move k=I]
    [k_button       k=I target=*Kakutei]
[else]
    [yajirushi_move k=F]
    [k_button       k=F target=*BaTK_Joseki_B_3]
[endif]
[s]

*BaTK_Joseki_B_3
[k_check][jump cond=f.atari target=*Atari][cm]
[yajirushi_move k=E]
[k_button       k=E target=*Kakutei]
[s]

*BaTK_Joseki_B_4
[k_check][jump cond=f.atari target=*Atari][cm]
[yajirushi_move k=A]
[k_button       k=A target=*BaTK_Joseki_B_5]
[s]

*BaTK_Joseki_B_5
[k_check][jump cond=f.atari target=*Atari][cm]
[yajirushi_move k=C]
[k_button       k=C target=*BaTK_Joseki_B_6]
[s]

*BaTK_Joseki_B_6
[k_check][jump cond=f.atari target=*Atari][cm]
[yajirushi_move k=B]
[k_button       k=B target=*Kakutei]
[s]

;=======================================
*BaTK_Joseki_A
;=======================================
[cm]
[iscript]
f.joseki = "BaTK_Joseki_A"
[endscript]

[k_button  k=A target=*BaTK_Joseki_A_1]
[yajirushi k=A]
[s]

*BaTK_Joseki_A_1
[k_check][jump cond=f.atari target=*Atari][cm]
[if exp="gusherApp.isBrother('A', f.answer)"]
    [yajirushi_move k=C]
    [k_button       k=C target=*BaTK_Joseki_A_2]
[else]
    [yajirushi_move k=D]
    [k_button       k=D target=*BaTK_Joseki_A_3]
[endif]
[s]

*BaTK_Joseki_A_2
[k_check][jump cond=f.atari target=*Atari][cm]
[yajirushi_move k=B]
[k_button       k=B target=*Kakutei]
[s]

*BaTK_Joseki_A_3
[k_check][jump cond=f.atari target=*Atari][cm]
[if exp="gusherApp.isBrother('D', f.answer)"]
    [yajirushi_move k=F]
    [k_button       k=F target=*BaTK_Joseki_A_4]
[else]
    [yajirushi_move k=G]
    [k_button       k=G target=*BaTK_Joseki_A_5]
[endif]
[s]

*BaTK_Joseki_A_4
[k_check][jump cond=f.atari target=*Atari][cm]
[yajirushi_move k=E]
[k_button       k=E target=*Kakutei]
[s]

*BaTK_Joseki_A_5
[k_check][jump cond=f.atari target=*Atari][cm]
[yajirushi_move k=H]
[k_button       k=H target=*BaTK_Joseki_A_6]
[s]

*BaTK_Joseki_A_6
[k_check][jump cond=f.atari target=*Atari][cm]
[yajirushi_move k=I]
[k_button       k=I target=*Kakutei]
[s]

;=======================================
*SheTK_Joseki_A
;=======================================
[cm]
[iscript]
f.joseki = "SheTK_Joseki_A"
[endscript]

[k_button  k=E target=*SheTK_Joseki_A_1]
[yajirushi k=E]
[s]

*SheTK_Joseki_A_1
[k_check][jump cond=f.atari target=*Atari][cm]
[if exp="gusherApp.isBrother('E', f.answer)"]
    [yajirushi_move k=F]
    [k_button       k=F target=*SheTK_Joseki_A_2]
[else]
    [yajirushi_move k=H]
    [k_button       k=H target=*SheTK_Joseki_A_4]
[endif]
[s]

*SheTK_Joseki_A_2
[k_check][jump cond=f.atari target=*Atari][cm]
[yajirushi_move k=D]
[k_button       k=D target=*SheTK_Joseki_A_3]
[s]

*SheTK_Joseki_A_3
[k_check][jump cond=f.atari target=*Atari][cm]
[yajirushi_move k=C]
[k_button       k=C target=*Kakutei]
[s]

*SheTK_Joseki_A_4
[k_check][jump cond=f.atari target=*Atari][cm]
[if exp="gusherApp.isBrother('H', f.answer)"]
    [yajirushi_move k=G]
    [k_button       k=G target=*SheTK_Joseki_A_5]
[else]
    [yajirushi_move k=I]
    [k_button       k=I target=*SheTK_Joseki_A_6]
[endif]
[s]

*SheTK_Joseki_A_5
[k_check][jump cond=f.atari target=*Atari][cm]
[yajirushi_move k=A]
[k_button       k=A target=*Kakutei]
[s]

*SheTK_Joseki_A_6
[k_check][jump cond=f.atari target=*Atari][cm]
[yajirushi_move k=B]
[k_button       k=B target=*Kakutei]
[s]

;=======================================
*SheTK_Joseki_B
;=======================================
[cm]
[iscript]
f.joseki = "SheTK_Joseki_B"
[endscript]

[k_button  k=F target=*SheTK_Joseki_B_1]
[yajirushi k=F]
[s]

*SheTK_Joseki_B_1
[k_check][jump cond=f.atari target=*Atari][cm]
[if exp="gusherApp.isBrother('F', f.answer)"]
    [yajirushi_move k=D]
    [k_button       k=D target=*SheTK_Joseki_B_2]
[else]
    [yajirushi_move k=G]
    [k_button       k=G target=*SheTK_Joseki_B_4]
[endif]
[s]

*SheTK_Joseki_B_2
[k_check][jump cond=f.atari target=*Atari][cm]
[yajirushi_move k=E]
[k_button       k=E target=*SheTK_Joseki_B_3]
[s]

*SheTK_Joseki_B_3
[k_check][jump cond=f.atari target=*Atari][cm]
[yajirushi_move k=C]
[k_button       k=C target=*Kakutei]
[s]

*SheTK_Joseki_B_4
[k_check][jump cond=f.atari target=*Atari][cm]
[if exp="gusherApp.isBrother('G', f.answer)"]
    [yajirushi_move k=H]
    [k_button       k=H target=*SheTK_Joseki_B_5]
[else]
    [yajirushi_move k=I]
    [k_button       k=I target=*Kakutei]
[endif]
[s]

*SheTK_Joseki_B_5
[k_check][jump cond=f.atari target=*Atari][cm]
[if exp="gusherApp.isBrother('H', f.answer)"]
    [yajirushi_move k=A]
    [k_button       k=A target=*Kakutei]
[else]
    [yajirushi_move k=B]
    [k_button       k=B target=*Kakutei]
[endif]
[s]


;=======================================
*BaTK_Joseki_C
;=======================================
[cm]
[iscript]
f.joseki = "BaTK_Joseki_C"
[endscript]

[k_button  k=D target=*BaTK_Joseki_C_1]
[yajirushi k=D]
[s]

*BaTK_Joseki_C_1
[k_check][jump cond=f.atari target=*Atari][cm]
[if exp="gusherApp.isBrother('D', f.answer)"]
    [yajirushi_move k=F]
    [k_button       k=F target=*BaTK_Joseki_C_2]
[else]
    [yajirushi_move k=H]
    [k_button       k=H target=*BaTK_Joseki_C_4]
[endif]
[s]

*BaTK_Joseki_C_2
[k_check][jump cond=f.atari target=*Atari][cm]
[yajirushi_move k=E]
[k_button       k=E target=*Kakutei]
[s]

*BaTK_Joseki_C_4
[k_check][jump cond=f.atari target=*Atari][cm]
[if exp="gusherApp.isBrother('H', f.answer)"]
    [yajirushi_move k=G]
    [k_button       k=G target=*BaTK_Joseki_C_5]
[else]
    [yajirushi_move k=A]
    [k_button       k=A target=*BaTK_Joseki_C_6]
[endif]
[s]

*BaTK_Joseki_C_5
[k_check][jump cond=f.atari target=*Atari][cm]
[yajirushi_move k=I]
[k_button       k=I target=*Kakutei]
[s]

*BaTK_Joseki_C_6
[k_check][jump cond=f.atari target=*Atari][cm]
[yajirushi_move k=C]
[k_button       k=C target=*BaTK_Joseki_C_7]
[s]

*BaTK_Joseki_C_7
[k_check][jump cond=f.atari target=*Atari][cm]
[yajirushi_move k=B]
[k_button       k=B target=*Kakutei]
[s]


;=======================================
*SheMK_Joseki_A
;=======================================
[cm]
[iscript]
f.joseki = "SheMK_Joseki_A"
[endscript]

[k_button  k=F target=*SheMK_Joseki_A_1]
[yajirushi k=F]
[s]

*SheMK_Joseki_A_1
[k_check][jump cond=f.atari target=*Atari][cm]
[if exp="gusherApp.isBrother('F', f.answer)"]
    [yajirushi_move k=C]
    [k_button       k=C target=*Kakutei]
[else]
    [yajirushi_move k=G]
    [k_button       k=G target=*SheMK_Joseki_A_2]
[endif]
[s]

*SheMK_Joseki_A_2
[k_check][jump cond=f.atari target=*Atari][cm]
[yajirushi_move k=A]
[k_button       k=A target=*SheMK_Joseki_A_3]
[s]

*SheMK_Joseki_A_3
[k_check][jump cond=f.atari target=*Atari][cm]
[yajirushi_move k=B]
[k_button       k=B target=*Kakutei]
[s]


;=======================================
*BuTK_Joseki_A
;=======================================

[cm]
[iscript]
f.joseki = "BuTK_Joseki_A"
[endscript]

[k_button  k=B target=*BuTK_Joseki_A_1a]
[yajirushi k=B]
[k_button  k=C target=*BuTK_Joseki_A_1b]
[yajirushi k=C]
[s]

;B開け
*BuTK_Joseki_A_1a
[free layer=1 name=B]
[k_check][jump cond=f.atari target=*Atari][cm]
[k_button  k=C target=*BuTK_Joseki_A_2]
[s]

;C開け
*BuTK_Joseki_A_1b
[free layer=1 name=C]
[k_check][jump cond=f.atari target=*Atari][cm]
[k_button  k=B target=*BuTK_Joseki_A_2]
[s]

;どっちも開けた
*BuTK_Joseki_A_2
[iscript]
f.B = gusherApp.isBrother('B', f.answer);
f.C = gusherApp.isBrother('C', f.answer);
[endscript]
[k_check][jump cond=f.atari target=*Atari][cm]
;B大C小
[if    exp="f.B && !f.C"]
    [yajirushi_move k=E]
    [k_button       k=E target=*Kakutei]
;B大C大
[elsif exp="f.B && f.C"]
    [yajirushi_move k=D]
    [k_button       k=D target=*BuTK_Joseki_A_3]
;B小C大
[elsif exp="!f.B && f.C"]
    [yajirushi_move k=F]
    [k_button       k=F target=*Kakutei]
;B小C小
[elsif exp="!f.B && !f.C"]
    [yajirushi_move k=G]
    [k_button       k=G target=*BuTK_Joseki_A_4]
[endif]
[s]

*BuTK_Joseki_A_3
[k_check][jump cond=f.atari target=*Atari][cm]
[yajirushi_move k=A]
[k_button       k=A target=*Kakutei]
[s]

*BuTK_Joseki_A_4
[k_check][jump cond=f.atari target=*Atari][cm]
[yajirushi_move k=H]
[k_button       k=H target=*Kakutei]
[s]

;=======================================
*BuMK_Joseki_A
;=======================================
[cm]
[iscript]
f.joseki = "BuMK_Joseki_A"
[endscript]

[k_button  k=H target=*BuMK_Joseki_A_1]
[yajirushi k=H]
[s]

*BuMK_Joseki_A_1
[k_check][jump cond=f.atari target=*Atari][cm]
[if exp="gusherApp.isBrother('H', f.answer)"]
    [yajirushi_move k=F]
    [k_button       k=F target=*BuMK_Joseki_A_2]
[else]
    [yajirushi_move k=A]
    [k_button       k=A target=*Kakutei]
[endif]
[s]

*BuMK_Joseki_A_2
[k_check][jump cond=f.atari target=*Atari][cm]
[yajirushi_move k=D]
[k_button       k=D target=*Kakutei]
[s]

;=======================================
*PoMK_Joseki_A
;=======================================
[cm]
[iscript]
f.joseki = "PoMK_Joseki_A"
[endscript]

[k_button  k=E target=*PoMK_Joseki_A_1]
[yajirushi k=E]
[s]

*PoMK_Joseki_A_1
[k_check][jump cond=f.atari target=*Atari][cm]
[if exp="gusherApp.isBrother('E', f.answer)"]
    [yajirushi_move k=A]
    [k_button       k=A target=*Kakutei]
[else]
    [yajirushi_move k=B]
    [k_button       k=B target=*PoMK_Joseki_A_2]
[endif]
[s]

*PoMK_Joseki_A_2
[k_check][jump cond=f.atari target=*Atari][cm]
[yajirushi_move k=D]
[k_button       k=D target=*Kakutei]
[s]

;=======================================
*PoTK_Joseki_B
;=======================================

[cm]
[iscript]
f.joseki = "PoTK_Joseki_B"
[endscript]

[k_button  k=F target=*PoTK_Joseki_B_1]
[yajirushi k=F]
[s]

*PoTK_Joseki_B_1
[k_check][jump cond=f.atari target=*Atari][cm]
[if exp="gusherApp.isBrother('F', f.answer)"]
    [yajirushi_move k=G]
    [k_button       k=G target=*PoTK_Joseki_B_3]
[else]
    [yajirushi_move k=B]
    [k_button       k=B target=*PoTK_Joseki_B_2]
[endif]
[s]

*PoTK_Joseki_B_2
[k_check][jump cond=f.atari target=*Atari][cm]
[if exp="gusherApp.isBrother('B', f.answer)"]
    [yajirushi_move k=A]
    [k_button       k=A target=*Kakutei]
[else]
[endif]
[s]

*PoTK_Joseki_B_3
[k_check][jump cond=f.atari target=*Atari][cm]
[if exp="gusherApp.isBrother('G', f.answer)"]
    [yajirushi_move k=E]
    [k_button       k=E target=*Kakutei]
[else]
    [yajirushi_move k=C]
    [k_button       k=C target=*PoTK_Joseki_B_4]
[endif]
[s]

*PoTK_Joseki_B_4
[k_check][jump cond=f.atari target=*Atari][cm]
[if exp="gusherApp.isBrother('C', f.answer)"]
    [yajirushi_move k=D]
    [k_button       k=D target=*Kakutei]
[else]
[endif]
[s]

;=======================================
*ToTK_Joseki_B
;=======================================

[cm]
[iscript]
f.joseki = "ToTK_Joseki_B"
[endscript]

[k_button  k=F target=*ToTK_Joseki_B_1]
[yajirushi k=F]
[s]

*ToTK_Joseki_B_1
[k_check][jump cond=f.atari target=*Atari][cm]
[if exp="gusherApp.isBrother('F', f.answer)"]
    [yajirushi_move k=D]
    [k_button       k=D target=*ToTK_Joseki_B_2]
[else]
    [yajirushi_move k=E]
    [k_button       k=E target=*ToTK_Joseki_B_3]
[endif]
[s]

*ToTK_Joseki_B_2
[k_check][jump cond=f.atari target=*Atari][cm]
[if exp="gusherApp.isBrother('D', f.answer)"]
    [yajirushi_move k=B]
    [k_button       k=B target=*Kakutei]
[else]
    [yajirushi_move k=G]
    [k_button       k=G target=*Kakutei]
[endif]
[s]

*ToTK_Joseki_B_3
[k_check][jump cond=f.atari target=*Atari][cm]
[if exp="gusherApp.isBrother('E', f.answer)"]
    [yajirushi_move k=C]
    [k_button       k=C target=*Kakutei]
[else]
    [yajirushi_move k=A]
    [k_button       k=A target=*Kakutei]
[endif]
[s]

;=======================================
*ToTK_Joseki_A
;=======================================

[cm]
[iscript]
f.joseki = "ToTK_Joseki_A"
[endscript]

[k_button  k=F target=*ToTK_Joseki_A_1a]
[yajirushi k=F]
[k_button  k=G target=*ToTK_Joseki_A_1b]
[yajirushi k=G]
[s]

;F開け
*ToTK_Joseki_A_1a
[free layer=1 name=F]
[k_check][jump cond=f.atari target=*Atari][cm]
[k_button  k=G target=*ToTK_Joseki_A_2]
[s]

;G開け
*ToTK_Joseki_A_1b
[free layer=1 name=G]
[k_check][jump cond=f.atari target=*Atari][cm]
[k_button  k=F target=*ToTK_Joseki_A_2]
[s]

;どっちも開けた
*ToTK_Joseki_A_2
[iscript]
f.F = gusherApp.isBrother('F', f.answer);
f.G = gusherApp.isBrother('G', f.answer);
[endscript]
[k_check][jump cond=f.atari target=*Atari][cm]
;F大G小
[if    exp="f.F && !f.G"]
    [yajirushi_move k=D]
    [k_button       k=D target=*ToTK_Joseki_A_3]
;F大G大
[elsif exp="f.F && f.G"]
;F小G大
[elsif exp="!f.F && f.G"]
    [yajirushi_move k=E]
    [k_button       k=E target=*ToTK_Joseki_A_4]
;F小G小
[elsif exp="!f.F && !f.G"]
    [yajirushi_move k=A]
    [k_button       k=A target=*Kakutei]
[endif]
[s]

*ToTK_Joseki_A_3
[k_check][jump cond=f.atari target=*Atari][cm]
[yajirushi_move k=B]
[k_button       k=B target=*Kakutei]
[s]

*ToTK_Joseki_A_4
[k_check][jump cond=f.atari target=*Atari][cm]
[yajirushi_move k=C]
[k_button       k=C target=*Kakutei]
[s]

;=======================================
*ToMK_Joseki_A
;=======================================

[cm]
[iscript]
f.joseki = "ToMK_Joseki_A"
[endscript]

[k_button  k=F target=*ToMK_Joseki_A_1a]
[yajirushi k=F]
[k_button  k=G target=*ToMK_Joseki_A_1b]
[yajirushi k=G]
[s]

;F開け
*ToMK_Joseki_A_1a
[free layer=1 name=F]
[k_check][jump cond=f.atari target=*Atari][cm]
[k_button  k=G target=*ToMK_Joseki_A_2]
[s]

;G開け
*ToMK_Joseki_A_1b
[free layer=1 name=G]
[k_check][jump cond=f.atari target=*Atari][cm]
[k_button  k=F target=*ToMK_Joseki_A_2]
[s]

;どっちも開けた
*ToMK_Joseki_A_2
[iscript]
f.F = gusherApp.isBrother('F', f.answer);
f.G = gusherApp.isBrother('G', f.answer);
[endscript]
[k_check][jump cond=f.atari target=*Atari][cm]
;F大G小
[if    exp="f.F && !f.G"]
    [yajirushi_move k=B]
    [k_button       k=B target=*Kakutei]
;F大G大
[elsif exp="f.F && f.G"]
;F小G大
[elsif exp="!f.F && f.G"]
    [yajirushi_move k=C]
    [k_button       k=C target=*Kakutei]
;F小G小
[elsif exp="!f.F && !f.G"]
    [yajirushi_move k=A]
    [k_button       k=A target=*Kakutei]
[endif]
[s]

;=======================================
*PoTK_Joseki_A
;=======================================

[cm]
[iscript]
f.joseki = "PoTK_Joseki_A"
[endscript]

[k_button  k=F target=*PoTK_Joseki_A_1a]
[yajirushi k=F]
[k_button  k=G target=*PoTK_Joseki_A_1b]
[yajirushi k=G]
[s]

;F開け
*PoTK_Joseki_A_1a
[free layer=1 name=F]
[k_check][jump cond=f.atari target=*Atari][cm]
[k_button  k=G target=*PoTK_Joseki_A_2]
[s]

;G開け
*PoTK_Joseki_A_1b
[free layer=1 name=G]
[k_check][jump cond=f.atari target=*Atari][cm]
[k_button  k=F target=*PoTK_Joseki_A_2]
[s]

;どっちも開けた
*PoTK_Joseki_A_2
[iscript]
f.F = gusherApp.isBrother('F', f.answer);
f.G = gusherApp.isBrother('G', f.answer);
[endscript]
[k_check][jump cond=f.atari target=*Atari][cm]
[if    exp="f.F && !f.G"]
    [yajirushi_move k=C]
    [k_button       k=C target=*PoTK_Joseki_A_3]
[elsif exp="f.F && f.G"]
    [yajirushi_move k=E]
    [k_button       k=E target=*Kakutei]
[elsif exp="!f.F && f.G"]
    [yajirushi_move k=A]
    [k_button       k=A target=*Kakutei]
[elsif exp="!f.F && !f.G"]
    [yajirushi_move k=B]
    [k_button       k=B target=*Kakutei]
[endif]
[s]

*PoTK_Joseki_A_3
[k_check][jump cond=f.atari target=*Atari][cm]
[yajirushi_move k=D]
[k_button       k=D target=*Kakutei]
[s]



;=======================================
*Kakutei
;=======================================
[k_check][jump target=*Atari storage=learn.ks]
[s]



;=======================================
*Atari
;=======================================
[jump target=Atari storage=learn.ks]