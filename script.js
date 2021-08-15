        let video = document.querySelector("video");
        let recordBtn = document.querySelector("#record");
        let capBtn = document.querySelector("#capture");
        let recDiv = recordBtn.querySelector("div");
        let capDiv = capBtn.querySelector("div");
        let body = document.querySelector("body");
        let mediaRecorder;
        let isRecording = false;
        let chunks = [];
        let appliedFilter;
        let minZoom = 1;
        let maxZoom = 3;
        let filters = document.querySelectorAll("#filter");
        let zoomInBtn = document.querySelector(".zoom-in");
        let zoomOutBtn = document.querySelector(".zoom-out");
        let currZoom = 1;

        zoomInBtn.addEventListener("click", function (){
            if(currZoom < maxZoom){
                currZoom = currZoom + 0.1;
            }

            video.style.transform = `scale(${currZoom})`;
        });

        zoomOutBtn.addEventListener("click", function (){
            if(currZoom > minZoom){
                currZoom = currZoom - 0.1;
            }

            video.style.transform = `scale(${currZoom})`;
        });
        for(let i = 0; i < filters.length; i++){
            filters[i].addEventListener("click", function(e){
                removeFilter();
                appliedFilter = e.currentTarget.style.backgroundColor;
                let div = document.createElement("div");
                div.style.backgroundColor = appliedFilter;
                div.classList.add("filter-div");
                body.append(div);
            });
        }
        // startBtn.addEventListener("click", function(){
        //     // code likhna hai jisse recording start ho
        //     mediaRecorder.start();
        // });
        // stopBtn.addEventListener("click", function(){
        //     // code likhna hai jisse recording stop ho
        //     mediaRecorder.stop();
        // });
        recordBtn.addEventListener("click", function(e){
            if(isRecording){
                mediaRecorder.stop()
                isRecording = false;
                recDiv.classList.remove("record-animation");
            }else{
                mediaRecorder.start();
                appliedFilter = ""; //color remove
                removeFilter(); //ui se remove
                currZoom = 1;
                video.style.transform = `scale(${currZoom})`;
                isRecording = true;
                recDiv.classList.add("record-animation");
            }
        })
        capBtn.addEventListener("click", function () {
            // jobhi image screen prr dikhaara use save krwaaega

            if(isRecording) return;
            capDiv.classList.add("capture-animation")
            setTimeout(function (){
                capDiv.classList.remove("capture-animation")
            },1000)
            let canvas = document.createElement("canvas");
            canvas.height = video.videoHeight;
            canvas.width = video.videoWidth;
            let tool = canvas.getContext("2d");
            tool.drawImage(video, 0, 0);

            //origin shift

            tool.translate(canvas.width / 2, canvas.height / 2);

            tool.scale(currZoom, currZoom);

            tool.translate(-canvas.width / 2, -canvas.height / 2);

            tool.drawImage(video, 0, 0);

            if(appliedFilter){
                tool.fillStyle = appliedFilter;
                tool.fillRect(0, 0, canvas.height, canvas.width);
            }

            let link = canvas.toDataURL();
            let a = document.createElement("a");
            a.href = link;
            a.download = "img.png";
            a.click();
            a.remove();
            canvas.remove()

        });

        navigator.mediaDevices
            .getUserMedia({ video: true, audio: false})
            .then(function(mediaStream){
                mediaRecorder = new MediaRecorder(mediaStream);

                mediaRecorder.addEventListener("dataavailable", function(e){
                    chunks.push(e.data);
                });

                mediaRecorder.addEventListener("stop", function (e){
                    let blob = new Blob(chunks, {type: "video/mp4"});
                    let a = document.createElement("a");
                    let url = window.URL.createObjectURL(blob);
                    a.href = url;
                    a.download = "video.mp4";
                    a.click();
                    a.remove();
                });

                video.srcObject = mediaStream;
            })
            .catch(function (err){
                console.log(err);
            });

            function removeFilter(){
                let Filter = document.querySelector("#filter");
                if(Filter) Filter.remove();
            }