#!/bin/bash

python /home/azureuser/neural-style/neural-style/neural_style.py --content "/home/azureuser/StyleTransferBot/subject.jpg" --styles "/home/azureuser/StyleTransferBot/style_base.jpg" --output "results.jpg" --iterations 100 --print-iterations 10 --overwrite --maxwidth 500 --userid tmp_userid --network /home/azureuser/neural-style/neural-style/imagenet-vgg-verydeep-19.mat
