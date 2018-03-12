## PC specs
### Alexis Kanter
 * Windows 10 PRO 64 bit
 * Intel(R) Core i7-6700 3.40GHz
 * 8 GB RAM
 * GeForce GTX 960 4GB

### Windows 10 Dev PC (Applied Streetview office)
 * Windows 10 HOME 64 bit
 * Intel Core i7-6770K 4.0 GHz
 * 16 GB RAM
 * GeForce GTX 1080 8 GB

### Pavel
 * Windows 10 HOME 64 bit
 * Intel Core i5-6300HQ 2.3 GHz
 * 16 GB RAM
 * GeForce GTX 960M 4 GB

### Tobias
 * Windows 10 HOME 64 bit
 * Intel Core i5-3230 2.6 GHz
 * 8 GB RAM
 * no GPU (will have one machine available with same specs and GeForce GT 740M, 2GB)

### Tobias (google cloud vm)
 * Windows Server 2016
 * 4 vCPUs
 * 26 GB RAM
 * Nvidia Tesla K80

# 0.14.0
## Blurring 
Windows 10 Dev PC:
 * GPU:
   * Time per photo: 0.16s
   * Performance: 540000 photos/24h
 * CPU:
   * Time per photo: 6.45s
   * Performance: 13395 photos/24h

## Training

## Evaluating

# 0.12.3

# 0.10.0
To be filled in.  

**Speed**  
Blurring  
GPU   
CPU  
  
Learning  
GPU  
CPU  

Hardware:  
Windows 10 Dev PC (Applied Streetview Office)  
https://github.com/StreetviewTechnology/TensorFlow-blurring#windows-10-dev-pc-applied-streetview-office  
  
**Speed** 
Training
PK version: 0.17.0
Dataset: Rtk2018-Bahnstrasse-Markings-Milica

Time per step 0.69sec
(about 5h for 25.000 steps)

Hardware (local machine Tobias):  
Windows version: Microsoft Windows 10 Home 64-Bit
Computer name: DESKTOP-24
Processor: Intel(R) Core(TM) i5-7400 CPU @ 3.00GHz
Memory: Total: 15,94 GB, Available: 11,94 GB
Free disk space: C: 119,43 GB, D: 876,72 GB, E: 1,57 GB
Graphics Card: NVIDIA GeForce GTX 1060 3GB (3 GB)
CUDA: 8.0


**Accuracy**  


11.03.2018, Tobias  
**Training data:** Frankfurt-Kaiserstrasse-All (proper Milica markings, 10.03.2018)  
**Evaluation data:** Rtk2018-Bahnstrasse-Markings (proper Milica markings, 10.03.2018)  

**Minimum conficence setting:** 50%

training steps | det. rate heads | false pos. heads | det. rate numb. | false pos. numb.
---------------|-----------------|------------------|-----------------|-----------------
10000		   | 61,33%			 | 22,35%			| 88,00%		  |	13,98%				 
25000		   | 0				 | 0				| 0				  |	0				 
50000		   | 0				 | 0				| 0				  |	0				 


**Minimum conficence setting:** 20%

training steps | det. rate heads | false pos. heads | det. rate numb. | false pos. numb.
---------------|-----------------|------------------|-----------------|-----------------
10000		   | 77,33%			 | 28,10%			| 92,57%		  |	21,84%				 
25000		   | 0				 | 0				| 0				  |	0				 
50000		   | 0				 | 0				| 0				  |	0				 


**Minimum conficence setting:** 5%

training steps | det. rate heads | false pos. heads | det. rate numb. | false pos. numb.
---------------|-----------------|------------------|-----------------|-----------------
10000		   | 90,67%			 | 33,22%			| 94,29%		  |	31,67%				 
25000		   | 0				 | 0				| 0				  |	0				 
50000		   | 0				 | 0				| 0				  |	0				 


------------

10.03.2018, Tobias
**Training data:** Rtk2018-Bahnstrasse-Markings (first Milica markings 'non-proper' 07.03.2018) 
**Evaluation data:** Frankfurt-Kaiserstrasse-All (proper Milica markings v2, 10.03.2018)

**Minimum conficence setting:** 20%

training steps | det. rate heads | false pos. heads | det. rate numb. | false pos. numb.
---------------|-----------------|------------------|-----------------|-----------------
25000		   | 62,43%			 | 57,43%			| 71,32%		  |	14,67%				 


**Minimum conficence setting:** 5%

training steps | det. rate heads | false pos. heads | det. rate numb. | false pos. numb.
---------------|-----------------|------------------|-----------------|-----------------
25000		   | 67,20%			 | 58,73%			| 73,50%		  |	18,02%				 

------------


10.03.2018, Tobias
**Training data:** Rtk2018-Bahnstrasse-Markings (first Milica markings 'non-proper' 07.03.2018) 
**Evaluation data:** Rtk2018-Lutherplatz-Markings-Milica (first Milica markings 'non-proper' 07.03.2018) 

**Minimum conficence setting:** 20%

training steps | det. rate heads | false pos. heads | det. rate numb. | false pos. numb.
---------------|-----------------|------------------|-----------------|-----------------
25000		   | 85,71%			 | 0,00%			| 100,00%		  |	14,29%				 


**Minimum conficence setting:** 5%

training steps | det. rate heads | false pos. heads | det. rate numb. | false pos. numb.
---------------|-----------------|------------------|-----------------|-----------------
25000		   | 100,00%		 | 0,00%			| 100,00%		  |	18,00%				 


------------


10.03.2018, Tobias
**Training data:** Rtk2018-Lutherplatz-Markings-Milica (first Milica markings 'non-proper' 07.03.2018)  
**Evaluation data:** Rtk2018-Bahnstrasse-Markings (first Milica markings 'non-proper' 07.03.2018)

**Minimum conficence setting:** 20%

training steps | det. rate heads | false pos. heads | det. rate numb. | false pos. numb.
---------------|-----------------|------------------|-----------------|-----------------
25000		   | 58,14%			 | 43,64%			| 15,65%		  |	30,77%				 


**Minimum conficence setting:** 5%

training steps | det. rate heads | false pos. heads | det. rate numb. | false pos. numb.
---------------|-----------------|------------------|-----------------|-----------------
25000		   | 62,79%		 	 | 45,31%			| 19,05%		  |	39,06%				 

------------
  
Detector: Germany  
Dataset: Demo2  
Heads:  
Number-plates:  
  
Detector: Germany  
Dataset: Example-data  
Heads:  
Number-plates: 

Detector: Germany  
Dataset: Frankfurt  
Heads:  
Number-plates:  

# v0.9  
Hardware:  
Windows 10 Dev PC (Applied Streetview Office)  
https://github.com/StreetviewTechnology/TensorFlow-blurring#windows-10-dev-pc-applied-streetview-office  
  
**Speed**  
Blurring  
GPU   
CPU  

Learning  
GPU  
CPU  


Tobias, 06.01.2017
Blurring speed tested on Laptop i5 with GeForce GT 740M 2GB
Blurring Frankfurt_Kaiserstr. with Germany-Detector:

batch size: 1
preprocessing time: 0.21 sec
detection time: 3.23 sec
postprocessing time: 0.27 sec
total batch time: 3.71 sec
total time per image: 3.71 sec
blurred heads in batch: 7
blurred number plates in batch: 1
mean score heads in batch 64.44 %
mean score number plates in batch 98.32 %
------------------
blurred heads total: 35
blurred number plates total: 24
mean score heads total 72.83 %
mean score number plates total 96.09 %
Processed 17 of 24 images (70.8% finished)
Estimated remaining time: 00:00:25
Estimated time of completion: 06-Jan-18, 10:06:51 PM

## gpuimg  
A helper program to test the performance using the GPU for **reading, pre-processing, blurring, post-processing, saving**.  
Not the actual detection.  
  
Hardware:  
Windows 10 Dev PC (Applied Streetview Office)  
https://github.com/StreetviewTechnology/TensorFlow-blurring#windows-10-dev-pc-applied-streetview-office  
  
Test results:  
  
With blurring  
Running in parallel...  
CPU (8 threads): 22ms per image. 360 images in 8191ms.  
GPU (20 threads): 9ms per image. 360 images in 3325ms.  
Running in sequence...  
CPU (1 threads): 76ms per image. 360 images in 27489ms.  
GPU (1 threads): 17ms per image. 360 images in 6264ms.  
  
Without blurring  
Running in parallel...  
CPU (8 threads): 19ms per image. 11951 images in 238549ms.  
GPU (20 threads): 4ms per image. 11951 images in 50339ms.  
Running in sequence...  
CPU (1 threads): 61ms per image. 11951 images in 734532ms.  
GPU (1 threads): 10ms per image. 11951 images in 122522ms.

