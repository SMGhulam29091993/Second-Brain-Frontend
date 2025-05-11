import { Card } from './component/ui/card';

function App() {
    let link = 'https://www.youtube.com/watch?v=6t6ZYsLXMWU';
    let link2 = 'https://x.com/realDonaldTrump/status/1921174163848401313';
    let link3 = 'https://www.facebook.com/photo/?fbid=3089079827933310&set=a.104999929674663';
    // let link4 = 'https://github.com/SMGhulam29091993/Second-Brain-Frontend';
    let link4 = 'https://github.com/Bharat2044/100xDevs-Cohort3-WebDev-and-Devops';

    return (
        <div className="flex items-center justify-center gap-2 h-screen">
            <Card title={'Test Card Youtube'} link={link} type={'youtube'} />
            <Card title={'Test Card Twitter/X'} link={link2} type={'twitter'} />
            <Card title={'Test Card Facebook'} link={link3} type={'facebook'} />
            <Card title={'Test Card Github'} link={link4} type={'github'} />
        </div>
    );
}

export default App;
