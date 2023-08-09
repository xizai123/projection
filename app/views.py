#coding=utf-8
from django.shortcuts import render
from django.shortcuts import render_to_response, RequestContext
from django.http import HttpResponse
import json
import numpy as np
from sklearn import metrics

# Create your views here.
def home(request):
	if request.method == 'POST':
		#求轮廓系数与CH指数
		if request.is_ajax() and request.POST['id'] == 'request_silhouette_score':
			data=request.POST.get('data')
			n=request.POST.get('n');n = n.encode("utf-8");n = int(n);m=2
			label=request.POST.get('label')

			dataList=data.split(',')
			temp = []
			for i in range(n):
				for j in range(m):
					temp.append(float(dataList[i * m + j]))
			dataMat = np.array(temp)
			dataMat = dataMat.reshape((n, m))

			labelList=label.split(',')
			temp=[]
			for i in range(n):
				temp.append(labelList[i])
			labelMat=np.array(temp)

			# print(dataMat)
			# print(labelMat)

			#求轮廓系数
			sil_coe=metrics.silhouette_score(
				dataMat,labelMat
			)
			#求CH指数
			CH_index=metrics.calinski_harabaz_score(dataMat,labelMat)

			result = {"sil_coe": sil_coe,"CH_index":CH_index}
			return HttpResponse(json.dumps(result))

		if request.is_ajax() and request.POST['id'] == 'requestPca':
			n = request.POST.get("n")
			m = request.POST.get("m")
			Data = request.POST.get("Data")


			n = n.encode("utf-8")
			m = m.encode("utf-8")
			# Data = Data.encode("utf-8")
			n = int(n)
			m = int(m)
			DataList = Data.split(',')
			
			tem = []
			for i in range(n):
				for j in range(m):
					tem.append(float(DataList[i * m + j]))
			dataMat = np.array(tem)

			# print(dataMat)

			dataMat = dataMat.reshape((n, m))

			# print(dataMat)

			pcavec = Pca(dataMat)
			temresult=np.mat(dataMat)*np.mat(pcavec)
			temresult=np.array(temresult)
			dataresult = []
			for i in range(len(temresult)):
				restem = []
				for j in range(len(temresult[0])):
					restem.append(temresult[i][j])
				dataresult.append(restem)
			result={"res":dataresult,"vec":pcavec}
			return HttpResponse(json.dumps(result))

		if request.is_ajax() and request.POST['id'] == 'requestCov':
			n = request.POST.get("n")
			sn = request.POST.get("sn")
			rn = request.POST.get("rn")
			m = request.POST.get("m")

			data = request.POST.get("data")
			selectdata = request.POST.get("selectdata")
			remaindata = request.POST.get("remaindata")

			n = n.encode("utf-8")
			sn = sn.encode("utf-8")
			rn = rn.encode("utf-8")
			m = m.encode("utf-8")

			# data = data.encode("utf-8")
			selectdata = selectdata.encode("utf-8")
			remaindata = remaindata.encode("utf-8")

			n = int(n)
			sn = int(sn)
			rn = int(rn)
			m = int(m)

			dataList = data.split(',')
			selectdataList=selectdata.split(',')
			remaindataList=remaindata.split(',')
			tem = []
			for i in range(n):
				for j in range(m):
					tem.append(float(dataList[i * m + j]))
			dataMat = np.array(tem)
			dataMat = dataMat.reshape((n, m))

			stem = []
			for i in range(sn):
				for j in range(m):
					stem.append(float(selectdataList[i * m + j]))
			selectdataMat = np.array(stem)
			selectdataMat = selectdataMat.reshape((sn, m))

			rtem = []
			for i in range(rn):
				for j in range(m):
					rtem.append(float(remaindataList[i * m + j]))
			remaindataMat = np.array(rtem)
			remaindataMat = remaindataMat.reshape((rn, m))

			covvec =covsvd(selectdataMat,remaindataMat)

			temresult=np.mat(dataMat)*np.mat(covvec)
			temresult=np.array(temresult)
			dataresult = []
			for i in range(len(temresult)):
				restem = []
				for j in range(len(temresult[0])):
					restem.append(temresult[i][j])
				dataresult.append(restem)
			result={"res":dataresult,"vec":covvec}
			return HttpResponse(json.dumps(result))
		if request.is_ajax() and request.POST['id'] == 'requestMds':
			n = request.POST.get("n")  # 采样正交向量大小
			m = request.POST.get("m")  # 采样正交向量维度
			s = request.POST.get("s")  # 采样正交向量二次维度
			Data = request.POST.get("Data")  # 采样正交向量
			n = n.encode("utf-8")
			m = m.encode("utf-8")
			s = s.encode("utf-8")
			# Data = Data.encode("utf-8")
			n = int(n)
			m = int(m)
			s = int(s)
			DataList = Data.split(',')
			tem = []
			for i in range(len(DataList)):
				tem.append(float(DataList[i]))
			dataMat = np.array(tem)
			dataMat = dataMat.reshape((n, m * s))
			distmatrix = subspaceMatrix(dataMat, n, m, s)
			mdsresult = []
			tempmds = NMds(distmatrix)
			for i in range(tempmds.shape[0]):
				mdstem = []
				for j in range(tempmds.shape[1]):
					mdstem.append(tempmds[i][j])
				mdsresult.append(mdstem)
			result = {"mds": mdsresult}
			return HttpResponse(json.dumps(result))

		if request.is_ajax() and request.POST['id'] == 'requestDsimilarity':
			Data = request.POST.get("Data")
			vectorData=request.POST.get("vectorData")
			selectData = request.POST.get("selectData")
			n = request.POST.get("n")
			vn=request.POST.get("vn")
			sn=request.POST.get("sn")

			m = request.POST.get("m")
			sm=request.POST.get("sm")
			smm = request.POST.get("smm")

			# Data = Data.encode("utf-8")
			# vectorData=vectorData.encode("utf-8")
			# selectData = selectData.encode("utf-8")

			n = n.encode("utf-8")
			vn=vn.encode("utf-8")
			sn = sn.encode("utf-8")

			m = m.encode("utf-8")
			sm = sm.encode("utf-8")
			smm=smm.encode("utf-8")

			DataList = Data.split(',')
			vectorDataList=vectorData.split(',')
			selectDataList = selectData.split(',')
			n = int(n)
			vn=int(vn)
			sn = int(sn)

			m = int(m)
			sm = int(sm)
			smm = int(smm)

			tem = []
			for i in range(len(DataList)):
				tem.append(float(DataList[i]))
			dataMat = np.array(tem)
			dataMat = dataMat.reshape((n,m))


			vtem=[]
			for i in range(len(vectorDataList)):
				vtem.append(float(vectorDataList[i]))
			vectorDataMat=np.array(vtem)
			vectorDataMat=vectorDataMat.reshape((vn,sm*smm))

			stem = []
			for i in range(len(selectDataList)):
				stem.append(float(selectDataList[i]))
			selectDataMat = np.array(stem)
			selectDataMat = selectDataMat.reshape((sn, sm * smm))

			#数据处理区域
			#处理data
			dataMat = np.transpose(dataMat)
			ones = np.ones(n)
			newData = np.vstack((dataMat, ones))

			#处理selectdata
			temSelectData=[]
			for sx in selectDataMat:
				si=sx.reshape((sm,smm))
				for ssx in si:
					temSelectData.append(ssx)
			temzeros=np.zeros(smm)
			tempSelectData=np.vstack((temSelectData,temzeros))
			tempzeros=[]
			for i in range(sm*sn):
				tempzeros.append([0])
			tempzeros.append([1])
			tempzeros=np.array(tempzeros)
			newSelectData=np.hstack((tempSelectData,tempzeros))

			#计算每个投影的不相似性
			Dsimilarity=[]
			for vx in vectorDataMat:
				Dsimilarity.append(subspaceDsimilarity(newData,newSelectData,vx,sm,smm))

			maxDsimilarity=max(Dsimilarity)
			for i in range(len(Dsimilarity)):
				if(Dsimilarity[i]==maxDsimilarity):
					resVec=vectorDataMat[i]
			resVec=np.array(resVec)
			resVec=resVec.reshape((sm,smm))
			res=[]
			for i in range(sm):
				temres=[]
				for j in range(smm):
					temres.append(resVec[i][j])
				res.append(temres)
			result = {"vec":res}
			return HttpResponse(json.dumps(result))

		return HttpResponse(json.dumps({'message': "1"}))
	return render_to_response('home.html',{'handler': []}, context_instance=RequestContext(request))

#求投影子空间不相似性
def subspaceDsimilarity(Data,A,tb,sm,smm):
	Data = np.mat(Data)
	A = np.mat(A)
	TA = np.transpose(A)

	bi=tb.reshape(sm,smm)
	temzeros = np.zeros(smm)
	tembi=np.vstack((bi,temzeros))
	tempzeros=[]
	for i in range(sm):
		tempzeros.append([0])
	tempzeros.append([1])
	tempzeros=np.array(tempzeros)
	B=np.hstack((tembi,tempzeros))
	B = np.mat(B)

	I=np.zeros((smm+1,smm+1))
	for i in range(smm+1):
		for j in range(smm+1):
			if(i==j):
				I[i][j]=1
	I=np.mat(I)

	TData=np.transpose(Data)
	D=Data*TData
	# d=np.dot(Data,TData)


	Inv=np.linalg.inv(A*D*TA)
	# inv=np.linalg.inv(np.dot(np.dot(A,D),TA))

	temMat=D*TA*Inv*A
	# temmat=np.dot(np.dot(np.dot(D,TA),Inv),A)
	tempMat=I-temMat
	H=tempMat*Data

	E=B*H
	E=np.array(E)

	sum=0
	for i in range(sm+1):
		for j in range(smm):
			sum=sum+E[i][j]*E[i][j]
	res=sum/smm
	return res
#求子空间距离矩阵函数
def subspaceMatrix(subdata,n,m,se):
    dist=np.zeros((n,n))
    for i in range(n):
        for j in range(i+1,n):
            Vi = subdata[i].reshape((m,se))
            Vj = subdata[j].reshape((m,se))
            Vi = np.matrix(Vi)
            Vj = np.matrix(Vj)
            Vjt=np.transpose(Vj)
            V=Vi*Vjt
            [u,s,v]=np.linalg.svd(V)
            sn=len(s)
            temlast=0
            for k in range(sn):
                temlast=temlast+s[k]*s[k]
            last=1-np.sqrt(temlast/sn)
            dist[i][j]=last
            dist[j][i]=last
    return dist

#求MDS布局函数
def NMds(d):
    dimensions = 2
    d = np.array(d) #注意d要为对称矩阵
    (n,n) = d.shape
    E = (-0.5 * d**2)

    # Use mat to get column and row means to act as column and row means.
    Er = np.mat(np.mean(E,1))
    Es = np.mat(np.mean(E,0))

    # From Principles of Multivariate Analysis: A User's Perspective (page 107).
    F = np.array(E - np.transpose(Er) - Es + np.mean(E))

    [U, S, V] = np.linalg.svd(F, full_matrices=True)

    Y = U * np.sqrt(S)
    return (Y[:,0:dimensions])
#PCA函数
def Pca(tem):
    length=2
    row=np.shape(tem)[0]
    col=np.shape(tem)[1]
    mat=[]
    for i in range(row):
        for j in range(col):
            mat.append(float(tem[i][j]))
    mat=np.array(mat)
    mat=mat.reshape((row,col))
    mat=np.mat(mat)
    meanval=np.mean(mat,axis=0)
    rmmeanMat=mat-meanval
    covMat=np.cov(rmmeanMat,rowvar=0)
    eigval,eigevc=np.linalg.eig(covMat)
    tfMat=eigevc[:,0:length]
    result = []
    for i in range(tfMat.shape[0]):
        result.append([tfMat[i][0],tfMat[i][1]])
    return result

#协方差SVD函数
def covsvd(class1,class2):
    length=2
    cov1=np.cov(np.mat(class1),rowvar=0)
    cov2=np.cov(np.mat(class2),rowvar=0)
    invercov1=np.linalg.inv(cov1)
    originmat=np.mat(invercov1)*np.mat(cov2)
    U,S,V=np.linalg.svd(originmat)
    vector=np.array(U[:,0:length])
    result=[]
    for i in range(vector.shape[0]):
        result.append([vector[i][0],vector[i][1]])
    return result
