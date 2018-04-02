var swiper = new Swiper('.swiper-container', {
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    direction : 'horizontal',
    initialSlide :2,
    // speed:300,
    // autoplay : {
    //     delay:3000
    // },
});


var  iscroll=new IScroll(".content",{
    mouseWheel: true,
    scrollbars: true,
    shrinkScrollbars:"scale",   //滚动条超出后缩小
    fadeScrollbars:true,
    click:true,
});
//点击新增
var state="project"
$(".add").click(function(){
    $(".mask").show();
    $(".submit").show();
    $(".update").hide();
    $(".inputarea").transition({y:0},500);
});
//点击取消
$(".cancel").click(function(){
    $(".inputarea").transition({y:"-62vh"},500,function(){
        $(".mask").hide();
    })
})
//点击提交
$(".submit").click(function(){
    var val=$("#text").val();
    if(val===""){
        return;
    }
    $("#text").val("");
    var data=getData();
    var time=new Date().getTime();
    data.push({content:val,time,star:false,done:false});
    saveData(data);
    render();
    $(".inputarea").transition({y:"-62vh"},500,function(){
        $(".mask").hide();
    })
})

$(".project").click(function(){
    $(this).addClass("active").siblings().removeClass("active");
    state="project";
    render();
})
$(".done").click(function(){
    $(this).addClass("active").siblings().removeClass("active");
    state="done";
    render();
})
//点击更新
$(".update").click(function(){
    var val=$("#text").val();
    if(val===""){
        return;
    }
    $("#text").val("");
    var data=getData();
    var index=$(this).data("index");
    data[index].content=val;
    saveData(data);
    render();
    $(".inputarea").transition({y:"-62vh"},500,function(){
        $(".mask").hide();
    })
})

$(".item_list")
    //完成
    .on("click",".changestate",function(){
    var index=$(this).parent().attr("id");
    var data=getData();
    data[index].done=true;
    saveData(data);
    render();
})
    //删除
    .on("click",".del",function(){
        var index=$(this).parent().attr("id");
        var data=getData();
        data.splice(index,1);
        saveData(data);
        render();
    })
    //选中星星
    .on("click","span",function(){
        var index=$(this).parent().attr("id");
        var data=getData();
        data[index].star=!data[index].star;
        saveData(data);
        render();
    })
    //更新内容
    .on("click","p",function(){
        var index=$(this).parent().attr("id");
        var data=getData();
        $(".mask").show();
        $(".inputarea").transition({y:0},500);
        $("#text").val(data[index].content)
        $(".submit").hide();
        $(".update").show().data("index",index);
    })
function getData(){
    return localStorage.todo?JSON.parse(localStorage.todo):[];
}
function saveData(data){
    localStorage.todo=JSON.stringify(data);
}
function render(){
    var data=getData();
    var str="";
    data.forEach(function(val,index){
        if(state==="project"&&val.done===false){
        str+="<li id="+index+"><p>"+val.content+"</p><time>"+parseTime(val.time)+"</time><span class="+(val.star?"active":"")+">*</span><div class='changestate'>完成</div></li>";
        }else if(state==="done"&&val.done===true){
            str+="<li id="+index+"><p>"+val.content+"</p><time>"+parseTime(val.time)+"</time><span class="+(val.star?"active":"")+">*</span><div class='del'>删除</div></li>";
        }
    });
    $(".item_list").html(str);
    iscroll.refresh();
    addtouch();
}
// render();

function parseTime(time){
    var date=new Date();
    date.setTime(time);
    var year=date.getFullYear();
    var month=setZero(date.getMonth()+1);
    var day=setZero(date.getDate());
    var hour=setZero(date.getHours());
    var min=setZero(date.getMinutes());
    var seconds=setZero(date.getSeconds());
    return year+"/"+month+"/"+day+"<br>"+hour+":"+min+":"+seconds;

}
function setZero(n){
    return n<10?"0"+n:n;
}
function addtouch(){
    $(".item_list>li").each(function(index,ele){

        let hammerobj=new Hammer(ele);
        let sx,movex;
        let max=window.innerWidth/5;
        let state="start";
        let flag=true;       //手指离开后要不要有动画
        hammerobj.on("panstart",function(e){
            ele.style.transition="";
            sx=e.center.x;
        })

        hammerobj.on("panmove",function(e){
            let cx=e.center.x;
            movex=cx-sx;
            if(movex>0&&state==="start"){   //向左走
                flag=false;
                return;
            }
            if(movex<0&&state==="end"){     //向右走
                flag=false;
                return;
            }
            if(Math.abs(movex)>max){
                flag=false;
                state=state==="start"?"end":"start";
                if(state==="end"){
                    ele.style.transform=`translateX(${-max}px)`;
                }else{
                    ele.style.transform=`translateX(0)`;
                }
                return;
            }
            if(state==="end"){
                movex=cx-sx-max;
            }
            flag=true;
            ele.style.transform=`translateX(${movex}px)`;
        })
        hammerobj.on("panend",function(){
            if(!flag){return}
            ele.style.transition="all .5s";
            if(Math.abs(movex)<max/2){
                ele.style.transform=`translateX(0)`;
                state="start";
            }else{
                ele.style.transform=`translateX(${-max}px)`;
                state="end";
            }
        })


    })
}

