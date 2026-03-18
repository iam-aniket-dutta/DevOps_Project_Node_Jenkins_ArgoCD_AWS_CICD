# Install ArgoCD on kubernetes cluster..
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Expose Argo CD Server Service in NodePort Mode
kubectl edit svc argocd-server -n argocd