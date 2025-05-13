import { useState } from 'react';
import { AddContentModal } from './component/sharedComponents/addContentModal.component';
import { Header } from './component/sharedComponents/header.component';
import { Card } from './component/ui/card';

function App() {
    const [open, setOpen] = useState<boolean>(false);

    let link = 'https://www.youtube.com/watch?v=6t6ZYsLXMWU';
    let link2 = 'https://x.com/realDonaldTrump/status/1921174163848401313';
    let link3 = 'https://www.facebook.com/photo/?fbid=3089079827933310&set=a.104999929674663';
    let link4 = 'https://github.com/SMGhulam29091993/Second-Brain';
    // let link4 = 'https://github.com/Bharat2044/100xDevs-Cohort3-WebDev-and-Devops';

    return (
        <div className="dark:bg-black bg-slate-100 min-h-screen">
            <Header setOpen={setOpen} />
            <AddContentModal open={open} onClose={() => setOpen(false)} />
            <div className="p-4 flex items-center justify-center flex-wrap gap-2">
                <Card title={'Test Card Youtube'} link={link} type={'youtube'} />
                <Card title={'Test Card Twitter/X'} link={link2} type={'twitter'} />
                <Card title={'Test Card Facebook'} link={link3} type={'facebook'} />
                <Card title={'Test Card Github'} link={link4} type={'github'} />
            </div>
        </div>
    );
}

export default App;
