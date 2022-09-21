set -ev

git fetch
# git stash
git reset --hard origin/new-design
# git stash apply
# npm run build

cd ..
tar --exclude="build" --exclude=".git" --exclude="node_modules" -zcvf memo-back.tar.gz memo-nft/
scp memo-back.tar.gz  ubuntu@nft-memo.org:/home/ubuntu/app

ssh ubuntu@nft-memo.org 'cd app; sudo systemctl stop NftMemo.service; tar -xvzf memo-back.tar.gz; sudo systemctl start NftMemo.service'