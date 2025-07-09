cd docs/dist/zh-CN
echo "docs-cn.docobase.com" >> CNAME
echo "" >> .nojekyll
git init
git remote add origin git@github.com:docobase/docs-cn.docobase.com.git
git branch -M main
git add .
git commit -m "first commit"
git push -f origin main
