set -ev

git fetch
# git stash
git reset --hard origin/new-design
# git stash apply
# npm run build

cd ..
tar -zcvf memo-front.tar.gz memo-nft/build/
scp memo-front.tar.gz  ubuntu@nft-memo.org:/home/ubuntu/app

ssh ubuntu@nft-memo.org 'cd app; tar -xvzf memo-front.tar.gz'