interface NftsText {
  title: string;
  description: string;
}

interface NftsIds {
  [key: number]: NftsText[];
}

interface NftsTexts {
  [key: string]: NftsIds;
}

export const NFT_INFO: NftsTexts = {
  '0xfc687Bd6B512CEa05b089dd91bA9147Ea073A9F2': {
    65: [
      {
        title: 'Your Acceptance',
        description: `By using and/or visiting this website located at the rad.live domain name (the “Website”) or any of the services,
        features, content or applications provided by Little Star Media, Inc. (“Little Star Media”, “Rad”, “we”, “us” or “our”),
        including without limitation those offered through the Website, iOS and Android mobile applications,
        Apple TV, Android TV, or any Smart TV applications, mobile virtual or augmented reality wearables,
        and any and all other immersive audio-visual experience applications,
        including but not limited to virtual reality and augmented reality applications (the “App” or “Apps”, collectively with the Website,
        the “Services”), you signify your agreement to (1) these terms and conditions (“Agreement”); (2) Little Star Media’s privacy 
          notice and incorporated here by reference; and (3) the Copyright Infringement Notification policy,
           (collectively, the “Terms of Service”).
          If you do not agree to any of these Terms of Service please do not use the Little Star Media Services.
  
          Although we may attempt to notify you when major changes are made to these Terms of Service, you should periodically
           review the most up-to-date version on this page. Little Star Media may, in its sole discretion, modify or revise 
           these Terms of Service and policies at any time, and you agree to be bound by such modifications or revisions.
            Nothing in this Agreement shall be deemed to confer any third-party rights or benefits.`,
      },
      {
        title: 'Little Star Media Services',
        description: `These Terms of Service apply to all users of the Little Star Media Services,
          including users who are also contributors of image content, video content, non-fungible
          tokens (“NFTs”), information, and any and all other materials or services on the Services.
          The Little Star Media Services includes all aspects of Little Star Media, including but
          not limited to all products, software, and services offered via the website.
  
          The Little Star Media Services may contain links to third party websites that are not owned 
          or controlled by Little Star Media. Little Star Media has no control over, and assumes no
          responsibility for, the content, privacy policies, or practices of any third party websites.
          In addition, Little Star Media will not and cannot censor or edit the content of any third-party 
          site. By using the Services, you expressly relieve Little Star Media from any and all liability 
          arising from your use of any third-party website.
          
          Accordingly, we encourage you to be aware when you leave the Little Star Media Services and to 
          read the terms and conditions and privacy policy of each third website that you visit.`,
      },
      {
        title: 'Rad Accounts',
        description: `In order to access some features of the Services, you will have to create a Rad account.
          You may never use another’s account without permission. When creating your account, you must provide 
          accurate and complete information. You are solely responsible for the activity that occurs on your account, 
          and you must keep your account password secure. You must notify Little Star Media immediately of any breach 
          of security or unauthorized use of your account.
  
          Although Little Star Media will not be liable for your losses caused by any unauthorized use of your account, 
          you may be liable for the losses of Little Star Media or others due to such unauthorized use.`,
      },
      {
        title: 'General Use of the Services-Permissions and Restrictions',
        description: `Little Star Media hereby grants you permission to access and use the Services as set forth 
          in these Terms of Service, provided that: You agree not to distribute in any medium any part of the Services, 
          including but not limited to User Submissions (defined below), without Little Star Media’s 
          prior written authorization.
  
          You agree not to alter or modify any part of the Services, including but not limited to Little Star Media’s 
          Embeddable Player or any of its related technologies.
          
          You agree not to access User Submissions (defined below) or Little Star Media Content (defined below) 
          through any technology or means other than the content pages or applications of the Services, 
          the Little Star Media Embeddable Player, or other explicitly authorized means Little Star Media may designate.
          
          Without Little Star Media’s express approval, you agree not to use the Services for commercial uses, 
          including: (i) sale of access to the Services or its related services (such as the Embeddable Player) 
          on another website; and (ii) any use of the Services or its related services (such as the Embeddable player) 
          that Little Star Media finds, in its sole discretion, to use Little Star Media’s resources or User Submissions 
          with the effect of competing with or displacing the market for Little Star Media, Little Star Media content, 
          or its User Submissions.
          
          Prohibited commercial uses do not include: (i) uploading original content to the Little Star Media Services 
          to promote your business or artistic enterprise; (ii) using the Embeddable Player to show videos on an ad-enabled 
          blog or website, provided the primary purpose of using the Embeddable Player is not to compete with Little Star Media; 
          and (iii) any use that Little Star Media expressly authorizes in writing.
          
          You agree not to use or launch any automated system, including without limitation, “robots,” “spiders,” or 
          “offline readers,” that accesses the Services in a manner that sends more request messages to the Little Star 
          Media servers in a given period of time than a human can reasonably produce in the same period by using a 
          conventional on-line web browser. Notwithstanding the foregoing, Little Star Media grants the operators of 
          public search engines permission to use spiders to copy materials from the site for the sole purpose of and 
          solely to the extent necessary for creating publicly available searchable indices of the materials, but not 
          caches or archives of such materials. Little Star Media reserves the right to revoke these exceptions either 
          generally or in specific cases. You agree not to collect or harvest any personally identifiable information, 
          including account names, from the Services, nor to use the communication systems provided by the Services for 
          any commercial solicitation purposes. You agree not to solicit, for commercial purposes, any users of the Services 
          with respect to their User Submissions.
          
          In your use of the website, you will otherwise comply with the terms and conditions of these Terms of Service, 
          and all applicable local, national, and international laws and regulations.
          
          Little Star Media reserves the right to discontinue any aspect of the Little Star Media Services at any time.`,
      },
    ],
  },
};
